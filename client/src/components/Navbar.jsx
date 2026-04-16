import { useEffect, useState } from "react";
import { FaBars, FaEnvelope, FaGithub, FaLinkedin, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.jpg";
import useViewport from "../hooks/useViewport";
import profile from "../data/profile";

const navLinks = [
    { href: "#about", label: "A propos" },
    { href: "#skills", label: "Competences" },
    { href: "#projects", label: "Projets" },
    { href: "#contact", label: "Contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { isMobile } = useViewport();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <nav
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: scrolled ? "12px 20px" : "18px 20px",
                background: scrolled ? "rgba(15,20,50,0.92)" : "transparent",
                backdropFilter: scrolled ? "blur(16px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.3s ease",
            }}
        >
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <img
                    src={logo}
                    alt="Mourad"
                    style={{
                        height: 56,
                        width: 56,
                        borderRadius: "9999px",
                        objectFit: "cover",
                        border: "2px solid rgba(99,102,241,0.6)",
                        boxShadow: "0 0 16px rgba(99,102,241,0.28)",
                    }}
                />
                <span
                    style={{
                        fontSize: 18,
                        fontWeight: 700,
                        letterSpacing: -0.4,
                        background: "linear-gradient(135deg, #6366f1, #a78bfa)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {profile.name}
                </span>
            </a>

            {isMobile ? (
                <button
                    type="button"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Toggle navigation menu"
                    style={{
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.2)",
                        width: 42,
                        height: 42,
                        borderRadius: 10,
                        color: "#e2e8f0",
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                    }}
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            style={{
                                color: "rgba(255,255,255,0.72)",
                                fontSize: 14,
                                fontWeight: 500,
                                textDecoration: "none",
                                transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
                        >
                            {link.label}
                        </a>
                    ))}

                    <div
                        style={{
                            display: "flex",
                            gap: 14,
                            marginLeft: 6,
                            borderLeft: "1px solid rgba(255,255,255,0.12)",
                            paddingLeft: 18,
                        }}
                    >
                        <a
                            href={profile.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "rgba(255,255,255,0.58)", fontSize: 18, transition: "color 0.2s" }}
                        >
                            <FaGithub />
                        </a>
                        <a
                            href={profile.links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "rgba(255,255,255,0.58)", fontSize: 18, transition: "color 0.2s" }}
                        >
                            <FaLinkedin />
                        </a>
                        <a
                            href={`mailto:${profile.email}`}
                            style={{ color: "rgba(255,255,255,0.58)", fontSize: 18, transition: "color 0.2s" }}
                        >
                            <FaEnvelope />
                        </a>
                    </div>
                    <a
                        href={profile.links.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: "none",
                            fontSize: 13,
                            color: "#e2e8f0",
                            border: "1px solid rgba(255,255,255,0.22)",
                            borderRadius: 999,
                            padding: "8px 14px",
                        }}
                    >
                        CV
                    </a>
                    <a
                        href={profile.links.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            textDecoration: "none",
                            fontSize: 13,
                            color: "#fff",
                            borderRadius: 999,
                            padding: "8px 14px",
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        }}
                    >
                        Calendly
                    </a>
                </div>
            )}

            {isMobile && menuOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 12,
                        right: 12,
                        marginTop: 10,
                        borderRadius: 14,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(5,10,22,0.95)",
                        backdropFilter: "blur(16px)",
                        padding: "14px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            style={{
                                color: "#e2e8f0",
                                fontSize: 15,
                                textDecoration: "none",
                                padding: "6px 2px",
                            }}
                        >
                            {link.label}
                        </a>
                    ))}
                    <a
                        href={profile.links.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#e2e8f0", fontSize: 15, textDecoration: "none", padding: "6px 2px" }}
                    >
                        CV
                    </a>
                    <a
                        href={profile.links.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#a5b4fc", fontSize: 15, textDecoration: "none", padding: "6px 2px" }}
                    >
                        Book a call
                    </a>
                </div>
            )}
        </nav>
    );
}
