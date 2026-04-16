import { motion } from 'framer-motion';
import useViewport from "../hooks/useViewport";

const skillGroups = [
    {
        category: 'Frontend',
        skills: [
            { name: 'React / Next.js', level: 95 },
            { name: 'TypeScript', level: 88 },
            { name: 'Tailwind CSS', level: 92 },
        ],
    },
    {
        category: 'Backend',
        skills: [
            { name: 'Node.js / Express', level: 90 },
            { name: 'MongoDB', level: 82 },
            { name: 'PostgreSQL', level: 78 },
        ],
    },
    {
        category: 'Outils',
        skills: [
            { name: 'Git & GitHub', level: 95 },
            { name: 'Docker', level: 72 },
            { name: 'Figma', level: 80 },
        ],
    },
];

export default function Skills() {
    const { isMobile, isTablet } = useViewport();

    return (
        <section id="skills" style={{ background: '#0a0f1e', padding: isMobile ? '90px 20px' : '120px 40px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                <motion.p
                    style={{ color: '#6366f1', fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                >
                    Compétences
                </motion.p>

                <motion.h2
                    style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
                        color: '#f1f5f9', marginBottom: 72, letterSpacing: -1,
                    }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                >
                    Mon stack technique
                </motion.h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, minmax(0, 1fr))' : 'repeat(3, minmax(0, 1fr))',
                        gap: isMobile ? 18 : 32
                    }}
                >
                    {skillGroups.map((group, gi) => (
                        <motion.div
                            key={group.category}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.07)',
                                borderRadius: 16, padding: 32,
                            }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: gi * 0.15, duration: 0.6 }}
                        >
                            <h3 style={{ color: '#a5b4fc', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 28 }}>
                                {group.category}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                {group.skills.map((skill, si) => (
                                    <div key={skill.name}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <span style={{ color: '#cbd5e1', fontSize: 14 }}>{skill.name}</span>
                                            <span style={{ color: '#6366f1', fontSize: 13, fontWeight: 600 }}>{skill.level}%</span>
                                        </div>
                                        <div style={{
                                            height: 4, background: 'rgba(255,255,255,0.08)',
                                            borderRadius: 4, overflow: 'hidden',
                                        }}>
                                            <motion.div
                                                style={{
                                                    height: '100%',
                                                    background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
                                                    borderRadius: 4,
                                                }}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.level}%` }}
                                                transition={{ duration: 1, delay: si * 0.1, ease: 'easeOut' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
