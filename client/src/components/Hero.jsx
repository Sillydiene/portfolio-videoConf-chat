import { motion } from 'framer-motion';
import { FaArrowDown, FaGithub, FaLinkedin } from 'react-icons/fa';
import logo from "../assets/profile.jpg";
import useViewport from "../hooks/useViewport";
import profile from "../data/profile";

export default function Hero() {
    const { isMobile } = useViewport();

    return (
        <section
            id="hero"
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                textAlign: 'center',
                padding: '0 24px',
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
                overflow: 'hidden',
            }}
        >
            {/* Decorative blobs */}
            <div style={{
                position: 'absolute', top: '15%', left: '10%',
                width: 320, height: 320,
                background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: '20%', right: '10%',
                width: 280, height: 280,
                background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(40px)', pointerEvents: 'none'
            }} />

            {/* ── PHOTO ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7 }}
                style={{ marginBottom: isMobile ? 22 : 32 }}
            >
                <img
                    src={logo}
                    alt="Mourad"
                    style={{
                        width: 'clamp(170px, 24vw, 240px)',
                        height: 'clamp(170px, 24vw, 240px)',
                        borderRadius: '9999px',
                        objectFit: 'cover',
                        border: '4px solid rgba(99,102,241,0.6)',
                        boxShadow: '0 0 0 8px rgba(99,102,241,0.1), 0 0 40px rgba(99,102,241,0.4)',
                    }}
                />
            </motion.div>

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'rgba(99,102,241,0.15)',
                    border: '1px solid rgba(99,102,241,0.4)',
                    borderRadius: 50, padding: '8px 20px',
                    fontSize: 13, letterSpacing: 2,
                    textTransform: 'uppercase', color: '#a5b4fc',
                    marginBottom: 28,
                }}
            >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
                {profile.availability}
            </motion.div>

            {/* Name */}
            <motion.h1
                style={{
                    fontSize: 'clamp(3rem, 8vw, 6rem)',
                    fontWeight: 800,
                    lineHeight: 1.1,
                    marginBottom: 20,
                    letterSpacing: '-2px',
                    background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {profile.name}
            </motion.h1>

            {/* Role */}
            <motion.p
                style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: 44,
                    fontWeight: 300,
                    letterSpacing: 1,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.35 }}
            >
                {profile.role} — {profile.stack}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            >
                <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                    style={{
                        padding: '14px 36px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        border: 'none', borderRadius: 50,
                        color: '#fff', fontSize: 16, fontWeight: 600,
                        cursor: 'pointer', letterSpacing: 0.5,
                    }}
                >
                    Me contacter
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => window.open(profile.links.cv, "_blank", "noopener,noreferrer")}
                    style={{
                        padding: '14px 36px',
                        background: 'transparent',
                        border: '1px solid rgba(255,255,255,0.25)',
                        borderRadius: 50, color: '#fff',
                        fontSize: 16, fontWeight: 500,
                        cursor: 'pointer', backdropFilter: 'blur(8px)',
                    }}
                >
                    Telecharger CV
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => window.open(profile.links.calendly, "_blank", "noopener,noreferrer")}
                    style={{
                        padding: '14px 30px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        borderRadius: 50, color: '#fff',
                        fontSize: 16, fontWeight: 500,
                        cursor: 'pointer', backdropFilter: 'blur(8px)',
                    }}
                >
                    Reserver un call
                </motion.button>
            </motion.div>

            {/* Social links */}
            <motion.div
                style={{ display: 'flex', gap: 20 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.65 }}
            >
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer"
                   style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22, transition: 'color 0.2s' }}
                   onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                   onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                    <FaGithub />
                </a>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer"
                   style={{ color: 'rgba(255,255,255,0.5)', fontSize: 22, transition: 'color 0.2s' }}
                   onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                   onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                >
                    <FaLinkedin />
                </a>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                style={{ position: 'absolute', bottom: 40, color: 'rgba(255,255,255,0.35)', fontSize: 20 }}
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <FaArrowDown />
            </motion.div>
        </section>
    );
}
