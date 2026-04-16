import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

function loadEnvFile() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const envPath = path.resolve(__dirname, "../.env");
    if (!fs.existsSync(envPath)) return;

    const raw = fs.readFileSync(envPath, "utf8");
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const idx = trimmed.indexOf("=");
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
        if (key && !process.env[key]) {
            process.env[key] = value;
        }
    }
}

loadEnvFile();

const PORT = Number(process.env.PORT || 3001);
const PROVIDER = (process.env.PROVIDER || "ollama").toLowerCase();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b";

// Videoconference rooms storage
const rooms = new Map();
const users = new Map();

function sendJson(res, status, payload) {
    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end(JSON.stringify(payload));
}

function extractUserText(history, fallbackMessage) {
    if (!Array.isArray(history)) return fallbackMessage;
    const mapped = history
        .filter((item) => item && typeof item.content === "string" && item.content.trim())
        .map((item) => ({ role: item.role === "assistant" ? "assistant" : "user", content: item.content.trim() }));
    if (mapped.length === 0) return fallbackMessage;
    return mapped[mapped.length - 1].content;
}

function normalizeHistory(history, fallbackMessage) {
    const mapped = Array.isArray(history)
        ? history
              .filter((item) => item && typeof item.content === "string" && item.content.trim())
              .map((item) => ({
                  role: item.role === "assistant" ? "assistant" : "user",
                  content: item.content.trim(),
              }))
        : [];

    if (mapped.length === 0 && fallbackMessage) {
        return [{ role: "user", content: fallbackMessage }];
    }
    return mapped;
}

function parseSseBlocks(buffer) {
    const parts = buffer.split("\n\n");
    const complete = parts.slice(0, -1);
    const remaining = parts[parts.length - 1] || "";
    return { complete, remaining };
}

function blockToDataLines(block) {
    return block
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim())
        .filter(Boolean);
}

async function callOpenAi(prompt, stream) {
    return fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            input: prompt,
            stream,
        }),
    });
}

async function callOllama(messages, stream) {
    return fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            messages,
            stream,
        }),
    });
}

function sendSseEvent(res, payload) {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

const httpServer = http.createServer(async (req, res) => {
    // REST API for videoconference
    if (req.url === "/api/rooms" && req.method === "POST") {
        const roomId = uuidv4();
        rooms.set(roomId, {
            id: roomId,
            participants: [],
            createdAt: new Date().toISOString(),
        });
        return sendJson(res, 200, { roomId });
    }

    if (req.url.startsWith("/api/rooms/") && req.method === "GET") {
        const roomId = req.url.split("/")[3];
        const room = rooms.get(roomId);
        if (room) {
            return sendJson(res, 200, { exists: true, participants: room.participants });
        }
        return sendJson(res, 200, { exists: false });
    }

    if (req.method === "OPTIONS") {
        return sendJson(res, 204, {});
    }

    if (req.method !== "POST" || (req.url !== "/api/chat" && req.url !== "/api/chat/stream")) {
        return sendJson(res, 404, { error: "Not found" });
    }

    if (PROVIDER !== "openai" && PROVIDER !== "ollama") {
        return sendJson(res, 500, { error: "Invalid PROVIDER. Use 'openai' or 'ollama'." });
    }

    if (PROVIDER === "openai" && !OPENAI_API_KEY) {
        return sendJson(res, 500, { error: "Missing OPENAI_API_KEY in environment." });
    }

    try {
        let raw = "";
        for await (const chunk of req) raw += chunk;
        const body = raw ? JSON.parse(raw) : {};
        const message = typeof body.message === "string" ? body.message.trim() : "";
        const prompt = message || extractUserText(body.history, "Bonjour");
        const messages = normalizeHistory(body.history, prompt);

        if (!prompt) {
            return sendJson(res, 400, { error: "message is required" });
        }

        if (req.url === "/api/chat/stream") {
            res.writeHead(200, {
                "Content-Type": "text/event-stream; charset=utf-8",
                "Cache-Control": "no-cache, no-transform",
                Connection: "keep-alive",
                "Access-Control-Allow-Origin": "*",
            });

            const apiRes =
                PROVIDER === "openai"
                    ? await callOpenAi(prompt, true)
                    : await callOllama(messages, true);

            if (!apiRes.ok || !apiRes.body) {
                let apiErr = `${PROVIDER} stream request failed`;
                try {
                    const errJson = await apiRes.json();
                    apiErr = errJson?.error?.message || errJson?.error || apiErr;
                } catch {
                    // Keep default message when response cannot be parsed.
                }
                sendSseEvent(res, { error: apiErr, done: true });
                return res.end();
            }

            const reader = apiRes.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                if (PROVIDER === "openai") {
                    const parsed = parseSseBlocks(buffer);
                    buffer = parsed.remaining;

                    for (const block of parsed.complete) {
                        const dataLines = blockToDataLines(block);
                        for (const dataLine of dataLines) {
                            try {
                                if (dataLine === "[DONE]") {
                                    sendSseEvent(res, { done: true });
                                    res.end();
                                    return;
                                }

                                const event = JSON.parse(dataLine);
                                if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
                                    sendSseEvent(res, { delta: event.delta });
                                } else if (event.type === "response.error") {
                                    sendSseEvent(res, { error: event?.error?.message || "Stream error", done: true });
                                    res.end();
                                    return;
                                } else if (event.type === "response.completed") {
                                    sendSseEvent(res, { done: true });
                                    res.end();
                                    return;
                                }
                            } catch {
                                // Ignore non-JSON data fragments.
                            }
                        }
                    }
                } else {
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        const dataLine = line.trim();
                        if (!dataLine) continue;
                        try {
                                const event = JSON.parse(dataLine);
                                if (event?.error) {
                                    sendSseEvent(res, { error: event.error, done: true });
                                    res.end();
                                    return;
                                }
                                const delta = event?.message?.content;
                                if (typeof delta === "string" && delta) {
                                    sendSseEvent(res, { delta });
                                }
                                if (event?.done) {
                                    sendSseEvent(res, { done: true });
                                    res.end();
                                    return;
                                }
                        } catch {
                            sendSseEvent(res, { error: "Invalid stream data from Ollama.", done: true });
                            res.end();
                            return;
                        }
                    }
                }
            }

            sendSseEvent(res, { done: true });
            return res.end();
        }

        const apiRes =
            PROVIDER === "openai"
                ? await callOpenAi(prompt, false)
                : await callOllama(messages, false);

        const apiJson = await apiRes.json();

        if (!apiRes.ok) {
            const apiError = apiJson?.error?.message || apiJson?.error || `${PROVIDER} request failed`;
            return sendJson(res, apiRes.status, { error: apiError });
        }

        const text =
            PROVIDER === "openai"
                ? typeof apiJson.output_text === "string"
                    ? apiJson.output_text
                    : ""
                : typeof apiJson?.message?.content === "string"
                  ? apiJson.message.content
                  : "";

        return sendJson(res, 200, { text });
    } catch (error) {
        return sendJson(res, 500, { error: error?.message || "Unexpected server error" });
    }
});

// Socket.IO for videoconference
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", ({ roomId, userId, userName }) => {
        socket.join(roomId);
        
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                id: roomId,
                participants: [],
                createdAt: new Date().toISOString(),
            });
        }

        const user = { id: userId, name: userName, socketId: socket.id };
        users.set(socket.id, { ...user, roomId });
        rooms.get(roomId).participants.push(user);

        socket.to(roomId).emit("user-joined", user);
        socket.emit("room-participants", rooms.get(roomId).participants);
        
        console.log(`User ${userName} joined room ${roomId}`);
    });

    socket.on("offer", ({ offer, targetUserId }) => {
        io.to(targetUserId).emit("offer", {
            offer,
            fromUserId: socket.id,
            targetUserId,
        });
    });

    socket.on("answer", ({ answer, targetUserId }) => {
        io.to(targetUserId).emit("answer", {
            answer,
            fromUserId: socket.id,
            targetUserId,
        });
    });

    socket.on("ice-candidate", ({ candidate, targetUserId }) => {
        io.to(targetUserId).emit("ice-candidate", {
            candidate,
            fromUserId: socket.id,
            targetUserId,
        });
    });

    socket.on("chat-message", ({ roomId, message, userId, userName }) => {
        io.to(roomId).emit("chat-message", {
            id: uuidv4(),
            message,
            userId,
            userName,
            timestamp: new Date().toISOString(),
        });
    });

    socket.on("whiteboard-draw", ({ roomId, data }) => {
        socket.to(roomId).emit("whiteboard-draw", data);
    });

    socket.on("whiteboard-clear", ({ roomId }) => {
        socket.to(roomId).emit("whiteboard-clear");
    });

    socket.on("toggle-video", ({ roomId, userId, enabled }) => {
        socket.to(roomId).emit("user-video-toggled", { userId, enabled });
    });

    socket.on("toggle-audio", ({ roomId, userId, enabled }) => {
        socket.to(roomId).emit("user-audio-toggled", { userId, enabled });
    });

    socket.on("disconnect", () => {
        const user = users.get(socket.id);
        if (user) {
            const { roomId } = user;
            const room = rooms.get(roomId);
            if (room) {
                room.participants = room.participants.filter(p => p.id !== user.id);
                socket.to(roomId).emit("user-left", user);
                
                if (room.participants.length === 0) {
                    rooms.delete(roomId);
                }
            }
            users.delete(socket.id);
        }
        console.log("User disconnected:", socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT} (provider=${PROVIDER})`);
});
