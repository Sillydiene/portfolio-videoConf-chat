import { useState, useRef, useEffect } from "react";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";

export default function ChatApp() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Salut. Pose ta question ici.",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const messagesEndRef = useRef(null);

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading, isOpen, error]);

    const sendMessage = async (event) => {
        event.preventDefault();
        const message = input.trim();

        if (!message || loading) return;

        setError("");

        const nextMessages = [...messages, { role: "user", content: message }];
        setMessages([...nextMessages, { role: "assistant", content: "" }]);
        setInput("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message,
                    history: nextMessages,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur serveur");
            }

            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: data.text || "(Réponse vide)",
                };
                return updated;
            });
        } catch (err) {
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: "Je n’ai pas pu répondre pour le moment.",
                };
                return updated;
            });

            setError(err.message || "Erreur inconnue");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Ouvrir le chat"
                style={{
                    position: "fixed",
                    right: "24px",
                    bottom: "24px",
                    width: "64px",
                    height: "64px",
                    borderRadius: "999px",
                    border: "none",
                    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
                    zIndex: 9999,
                }}
            >
                {isOpen ? <FaTimes size={22} /> : <FaComments size={22} />}
            </button>

            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        right: "24px",
                        bottom: "100px",
                        width: "420px",
                        maxWidth: "calc(100vw - 24px)",
                        height: "600px",
                        maxHeight: "78vh",
                        borderRadius: "20px",
                        overflow: "hidden",
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.10)",
                        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
                        zIndex: 9998,
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            padding: "16px",
                            background: "linear-gradient(135deg, #1e293b, #0f172a)",
                            borderBottom: "1px solid rgba(255,255,255,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <div
                                style={{
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                }}
                            >
                                Chat assistant
                            </div>
                            <div
                                style={{
                                    color: "#94a3b8",
                                    fontSize: "13px",
                                    marginTop: "4px",
                                }}
                            >
                                Pose ta question ici
                            </div>
                        </div>

                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Fermer le chat"
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#cbd5e1",
                                cursor: "pointer",
                            }}
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>

                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "18px 14px",
                            background: "#08122b",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        {messages.map((m, index) => (
                            <div
                                key={`${m.role}-${index}`}
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        m.role === "user" ? "flex-end" : "flex-start",
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: "78%",
                                        padding: "10px 14px",
                                        borderRadius: "16px",
                                        color: "#fff",
                                        fontSize: "15px",
                                        lineHeight: 1.45,
                                        whiteSpace: "pre-wrap",
                                        overflowWrap: "break-word",
                                        wordBreak: "break-word",
                                        background:
                                            m.role === "user"
                                                ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                                                : "rgba(255,255,255,0.10)",
                                        border:
                                            m.role === "user"
                                                ? "none"
                                                : "1px solid rgba(255,255,255,0.08)",
                                        boxShadow:
                                            m.role === "user"
                                                ? "0 8px 20px rgba(37,99,235,0.25)"
                                                : "none",
                                    }}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <div
                                    style={{
                                        maxWidth: "78%",
                                        padding: "10px 14px",
                                        borderRadius: "16px",
                                        color: "#cbd5e1",
                                        fontSize: "14px",
                                        background: "rgba(255,255,255,0.08)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                    }}
                                >
                                    L’assistant réfléchit...
                                </div>
                            </div>
                        )}

                        {error && (
                            <div
                                style={{
                                    marginTop: "4px",
                                    padding: "10px 12px",
                                    borderRadius: "12px",
                                    background: "rgba(239,68,68,0.12)",
                                    border: "1px solid rgba(239,68,68,0.25)",
                                    color: "#fca5a5",
                                    fontSize: "14px",
                                }}
                            >
                                Erreur de connexion : {error}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <form
                        onSubmit={sendMessage}
                        style={{
                            display: "flex",
                            gap: "10px",
                            padding: "14px",
                            background: "#0f172a",
                            borderTop: "1px solid rgba(255,255,255,0.08)",
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Écris ton message..."
                            style={{
                                flex: 1,
                                borderRadius: "16px",
                                border: "1px solid rgba(255,255,255,0.12)",
                                background: "rgba(255,255,255,0.05)",
                                color: "#fff",
                                padding: "14px 16px",
                                outline: "none",
                                fontSize: "15px",
                            }}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "52px",
                                height: "52px",
                                border: "none",
                                borderRadius: "16px",
                                background: loading ? "#334155" : "#2563eb",
                                color: "#fff",
                                cursor: loading ? "not-allowed" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                            }}
                        >
                            <FaPaperPlane size={16} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}