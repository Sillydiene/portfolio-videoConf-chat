import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import profile from "../data/profile";

export default function Footer() {
    return (
        <footer
            style={{
                background: "#070b14",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                padding: "34px 20px",
            }}
        >
            <div
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <p style={{ color: "#f1f5f9", margin: 0, fontSize: 15, fontWeight: 600 }}>{profile.name}</p>
                    <p style={{ color: "#94a3b8", margin: "6px 0 0", fontSize: 13 }}>
                        {profile.role} - {profile.stack}
                    </p>
                </div>

                <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
                    <a href="#about" style={{ color: "#cbd5e1", fontSize: 14, textDecoration: "none" }}>
                        A propos
                    </a>
                    <a href="#projects" style={{ color: "#cbd5e1", fontSize: 14, textDecoration: "none" }}>
                        Projets
                    </a>
                    <a href="#contact" style={{ color: "#cbd5e1", fontSize: 14, textDecoration: "none" }}>
                        Contact
                    </a>
                </div>

                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <a
                        href={profile.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "rgba(255,255,255,0.62)", fontSize: 17 }}
                    >
                        <FaGithub />
                    </a>
                    <a
                        href={profile.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "rgba(255,255,255,0.62)", fontSize: 17 }}
                    >
                        <FaLinkedin />
                    </a>
                    <a href={`mailto:${profile.email}`} style={{ color: "rgba(255,255,255,0.62)", fontSize: 17 }}>
                        <FaEnvelope />
                    </a>
                </div>
            </div>

            <p style={{ color: "#64748b", fontSize: 12, textAlign: "center", marginTop: 24 }}>
                © {new Date().getFullYear()} Mourad. Tous droits reserves.
            </p>
        </footer>
    );
}
