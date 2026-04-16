import { spawn } from "node:child_process";

const tasks = [
    { name: "server", cmd: "npm", args: ["run", "dev:server"] },
    { name: "client", cmd: "npm", args: ["run", "dev"] },
];

const children = tasks.map((task) => {
    const child = spawn(task.cmd, task.args, {
        stdio: "inherit",
        shell: true,
        env: process.env,
    });

    child.on("exit", (code) => {
        if (code !== 0) {
            console.error(`[${task.name}] exited with code ${code}`);
        }
    });

    return child;
});

function shutdown() {
    for (const child of children) {
        if (!child.killed) child.kill();
    }
    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
