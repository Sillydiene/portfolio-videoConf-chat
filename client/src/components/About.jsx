import { motion } from 'framer-motion';
import useViewport from "../hooks/useViewport";

export default function About() {
    const { isMobile } = useViewport();
    const stats = [
        { value: '5+', label: 'Années d\'expérience' },
        { value: '30+', label: 'Projets livrés' },
        { value: '15+', label: 'Clients satisfaits' },
    ];

    return (
        <section id="about" style={{
            background: '#0f172a',
            padding: isMobile ? '90px 20px' : '120px 40px',
        }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Section label */}
                <motion.p
                    style={{
                        color: '#6366f1', fontSize: 12, fontWeight: 700,
                        letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16,
                    }}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}
                >
                    À propos
                </motion.p>

                <motion.h2
                    style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
                        color: '#f1f5f9', marginBottom: 64,
                        lineHeight: 1.2, letterSpacing: -1,
                    }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                >
                    Passionné par le code,<br />
                    <span style={{
                        background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>obsédé par les détails.</span>
                </motion.h2>

                <motion.div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
                        gap: isMobile ? 34 : 80,
                        alignItems: 'center'
                    }}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                >
                    {/* Text */}
                    <div>
                        <p style={{ color: '#94a3b8', lineHeight: 1.9, fontSize: 17, marginBottom: 24 }}>
                            Je suis un développeur Full Stack avec 5 ans d'expérience dans la création d'applications web modernes, performantes et accessibles.
                        </p>
                        <p style={{ color: '#94a3b8', lineHeight: 1.9, fontSize: 17, marginBottom: 40 }}>
                            J'aime transformer des idées complexes en interfaces simples et élégantes, avec une attention particulière à l'expérience utilisateur et à la qualité du code.
                        </p>

                        {/* Stats */}
                        <div style={{ display: 'flex', gap: isMobile ? 18 : 40, flexWrap: 'wrap' }}>
                            {stats.map(stat => (
                                <div key={stat.label}>
                                    <p style={{
                                        fontSize: 36, fontWeight: 800, color: '#f1f5f9',
                                        background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                        marginBottom: 4,
                                    }}>{stat.value}</p>
                                    <p style={{ color: '#64748b', fontSize: 13, letterSpacing: 0.5 }}>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual card */}
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))',
                        border: '1px solid rgba(99,102,241,0.2)',
                        borderRadius: 20, padding: 40,
                        display: 'flex', flexDirection: 'column', gap: 20,
                    }}>
                        {['React & Next.js', 'Node.js & Express', 'MongoDB & PostgreSQL', 'Tailwind CSS', 'Docker & CI/CD'].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 16,
                                padding: '12px 0',
                                borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                            }}>
                                <span style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
                                    flexShrink: 0,
                                }} />
                                <span style={{ color: '#cbd5e1', fontSize: 15 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
