import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import useViewport from "../hooks/useViewport";
import { projects } from "../data/profile";

export default function Projects() {
    const { isMobile } = useViewport();

    return (
        <section id="projects" style={{ background: '#0f172a', padding: isMobile ? '90px 20px' : '120px 40px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                <motion.p
                    style={{ color: '#6366f1', fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                >
                    Projets
                </motion.p>

                <motion.h2
                    style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
                        color: '#f1f5f9', marginBottom: 72, letterSpacing: -1,
                    }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                >
                    Ce que j'ai construit
                </motion.h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
                                gap: 0,
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 20, overflow: 'hidden',
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            whileHover={{ borderColor: 'rgba(99,102,241,0.35)' }}
                        >
                            {/* Color block */}
                            <div style={{
                                background: project.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 40, fontWeight: 800, color: 'rgba(255,255,255,0.3)',
                                letterSpacing: -2,
                                minHeight: isMobile ? 130 : 'auto'
                            }}>
                                0{project.id}
                            </div>

                            {/* Content */}
                            <div style={{ padding: isMobile ? '24px 20px' : '36px 40px' }}>
                                <h3 style={{ color: '#f1f5f9', fontSize: 22, fontWeight: 700, marginBottom: 12, letterSpacing: -0.5 }}>
                                    {project.title}
                                </h3>
                                <p style={{ color: '#94a3b8', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                                    {project.description}
                                </p>
                                <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
                                    Impact: {project.impact}
                                </p>

                                {/* Tags */}
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                                    {project.tags.map(tag => (
                                        <span key={tag} style={{
                                            background: 'rgba(99,102,241,0.12)',
                                            border: '1px solid rgba(99,102,241,0.25)',
                                            color: '#a5b4fc', fontSize: 12, fontWeight: 500,
                                            padding: '4px 12px', borderRadius: 50,
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Links */}
                                <div style={{ display: 'flex', gap: 20 }}>
                                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                                       style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#94a3b8', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                                       onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                       onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                                    >
                                        <FaGithub /> Code source
                                    </a>
                                    <a href={project.live} target="_blank" rel="noopener noreferrer"
                                       style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#94a3b8', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                                       onMouseEnter={e => e.currentTarget.style.color = '#6366f1'}
                                       onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                                    >
                                        <FaExternalLinkAlt /> Voir le projet
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
