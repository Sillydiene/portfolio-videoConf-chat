import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSocket } from '../../context/SocketContext.jsx';
import { useMedia } from '../../context/MediaContext.jsx';
import VideoGrid from './VideoGrid.jsx';
import Controls from './Controls.jsx';
import Chat from './Chat.jsx';

export default function VideoConference({ roomId, userName, onLeave }) {
    const { socket, connected } = useSocket();
    const {
        localStream,
        getMedia,
        participants,
        peerConnections,
        remoteStreams,
        setRoomId,
    } = useMedia();

    const [mediaStarted, setMediaStarted] = useState(false);
    const [error, setError] = useState('');
    const [chatOpen, setChatOpen] = useState(false);

    const startMedia = async () => {
        try {
            setError('');

            if (!socket) {
                setError("Socket non connecté.");
                return;
            }

            setRoomId(roomId);
            await getMedia();
            setMediaStarted(true);

            socket.emit('join-room', {
                roomId,
                userId: socket.id,
                userName,
            });
        } catch (err) {
            setError("Impossible d'accéder à la caméra/micro. Vérifiez les permissions.");
            console.error(err);
        }
    };

    if (!connected) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    backgroundColor: '#111827',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div style={{ textAlign: 'center', color: '#ffffff' }}>
                    <div
                        style={{
                            fontSize: '48px',
                            marginBottom: '16px',
                            animation: 'spin 1s linear infinite',
                        }}
                    >
                        ⏳
                    </div>
                    <p>Connexion au serveur...</p>
                </div>
            </div>
        );
    }

    if (!mediaStarted) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #312e81, #581c87, #831843)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 20,
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                        padding: 32,
                        maxWidth: 448,
                        width: '100%',
                    }}
                >
                    <h2
                        style={{
                            fontSize: '24px',
                            fontWeight: 700,
                            color: '#1e293b',
                            marginBottom: '8px',
                        }}
                    >
                        Rejoindre la réunion
                    </h2>

                    <p style={{ color: '#64748b', marginBottom: '24px' }}>
                        Salle: {roomId}
                    </p>

                    {error && (
                        <div
                            style={{
                                backgroundColor: '#fee2e2',
                                border: '1px solid #f87171',
                                color: '#b91c1c',
                                padding: '12px 16px',
                                borderRadius: 8,
                                marginBottom: '16px',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <motion.button
                        onClick={startMedia}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            width: '100%',
                            backgroundColor: '#4f46e5',
                            color: '#ffffff',
                            padding: '12px 0',
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            marginBottom: '16px',
                            fontFamily: 'inherit',
                        }}
                    >
                        🎥 Démarrer la vidéo et l'audio
                    </motion.button>

                    <motion.button
                        onClick={onLeave}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            width: '100%',
                            backgroundColor: '#e5e7eb',
                            color: '#374151',
                            padding: '12px 0',
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                        }}
                    >
                        ← Retour
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#111827',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div
                style={{
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 700 }}>📹 VidéoConf</h1>
                    <p style={{ fontSize: '14px', color: '#9ca3af' }}>Salle: {roomId}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <motion.button
                        onClick={() => setChatOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            backgroundColor: '#4f46e5',
                            color: '#ffffff',
                            padding: '8px 16px',
                            borderRadius: 6,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: 'inherit',
                        }}
                    >
                        💬 Chat
                    </motion.button>

                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>
            {participants.length + 1} participant{participants.length + 1 > 1 ? 's' : ''}
          </span>

                    <motion.button
                        onClick={onLeave}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            padding: '8px 16px',
                            borderRadius: 6,
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: 'inherit',
                        }}
                    >
                        Quitter
                    </motion.button>
                </div>
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
                <VideoGrid
                    localStream={localStream}
                    participants={participants}
                    peerConnections={peerConnections}
                    remoteStreams={remoteStreams}
                />
            </div>

            <Controls onLeave={onLeave} />

            <Chat roomId={roomId} isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
    );
}