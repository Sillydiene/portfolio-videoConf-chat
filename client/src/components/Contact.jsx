import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaVideo } from 'react-icons/fa';
import useViewport from "../hooks/useViewport";
import profile from "../data/profile";
import VideoConferenceModal from './videoconference/VideoConferenceModal.jsx';

export default function Contact() {
    const { isMobile } = useViewport();
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [videoModalOpen, setVideoModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setFormData({ name: '', email: '', message: '' });
            setSubmitted(false);
        }, 3000);
    };

    const inputStyle = {
        width: '100%', padding: '14px 18px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 10, color: '#f1f5f9', fontSize: 15,
        outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit',
    };

    return (
        <section id="contact" style={{ background: '#0a0f1e', padding: isMobile ? '90px 20px' : '120px 40px' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                <motion.p
                    style={{ color: '#6366f1', fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 16 }}
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                >
                    Contact
                </motion.p>

                <motion.h2
                    style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
                        color: '#f1f5f9', marginBottom: 72, letterSpacing: -1,
                    }}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
                >
                    Travaillons ensemble
                </motion.h2>

                <motion.div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr',
                        gap: isMobile ? 28 : 64
                    }}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                >
                    {/* Info */}
                    <div>
                        <p style={{ color: '#94a3b8', fontSize: 16, lineHeight: 1.8, marginBottom: 48 }}>
                            Vous avez un projet en tête ? N'hésitez pas à me contacter, je réponds généralement sous 24h.
                        </p>

                        {/* Video Conference Button */}
                        <motion.button
                            onClick={() => setVideoModalOpen(true)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '18px',
                                borderRadius: 10,
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none',
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                                marginBottom: 48,
                                boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
                            }}
                        >
                            <FaVideo size={20} />
                            Démarrer une vidéoconférence
                        </motion.button>

                        {[
                            { Icon: FaEnvelope, label: 'Email', value: profile.email },
                            { Icon: FaPhone, label: 'Telephone', value: profile.phone },
                            { Icon: FaMapMarkerAlt, label: 'Localisation', value: profile.location },
                        ].map((item) => {
                            const Icon = item.Icon;
                            return (
                            <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 32 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 10,
                                    background: 'rgba(99,102,241,0.12)',
                                    border: '1px solid rgba(99,102,241,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#6366f1', fontSize: 16, flexShrink: 0,
                                }}>
                                    <Icon />
                                </div>
                                <div>
                                    <p style={{ color: '#64748b', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>{item.label}</p>
                                    <p style={{ color: '#cbd5e1', fontSize: 15 }}>{item.value}</p>
                                </div>
                            </div>
                        )})}
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <input
                            type="text" name="name" placeholder="Votre nom"
                            value={formData.name} onChange={handleChange} required
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <input
                            type="email" name="email" placeholder="Votre email"
                            value={formData.email} onChange={handleChange} required
                            style={inputStyle}
                            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />
                        <textarea
                            name="message" placeholder="Votre message"
                            value={formData.message} onChange={handleChange} required
                            rows={6}
                            style={{ ...inputStyle, resize: 'none' }}
                            onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.6)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        />

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                padding: '16px', borderRadius: 10,
                                background: submitted ? '#10b981' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                border: 'none', color: '#fff',
                                fontSize: 16, fontWeight: 600, cursor: 'pointer',
                                transition: 'background 0.3s', fontFamily: 'inherit',
                            }}
                        >
                            {submitted ? '✓ Message envoyé !' : 'Envoyer le message'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>

            {/* Video Conference Modal */}
            <VideoConferenceModal
                isOpen={videoModalOpen}
                onClose={() => setVideoModalOpen(false)}
                ownerName={profile.name}
            />
        </section>
    );
}
