import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketProvider } from '../../context/SocketContext.jsx';
import { MediaProvider } from '../../context/MediaContext.jsx';
import VideoConference from './VideoConference.jsx';

export default function VideoConferenceModal({ isOpen, onClose, ownerName = 'Propriétaire' }) {
  const [roomId, setRoomId] = useState('');
  const [inCall, setInCall] = useState(false);
  const [copied, setCopied] = useState(false);
  const [visitorName, setVisitorName] = useState('');

  const createRoom = async () => {
    if (!visitorName.trim()) return;
    
    try {
      const response = await fetch('http://localhost:3001/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setRoomId(data.roomId);
      setInCall(true);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const joinRoom = async (e) => {
    e.preventDefault();
    if (!roomId.trim() || !visitorName.trim()) return;
    setInCall(true);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    setInCall(false);
    setRoomId('');
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: '#ffffff',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 10,
    color: '#1e293b',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  const buttonPrimaryStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontFamily: 'inherit',
  };

  const buttonSecondaryStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: 10,
    background: '#e5e7eb',
    border: 'none',
    color: '#374151',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontFamily: 'inherit',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          {!inCall ? (
            <div style={{ padding: '32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>📹</div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '8px',
                }}>
                  Démarrer une vidéoconférence
                </h2>
                <p style={{ color: '#64748b', marginTop: '8px' }}>
                  Connectez-vous avec {ownerName}
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}>
                  Votre nom
                </label>
                <input
                  type="text"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  placeholder="Entrez votre nom"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.3)'}
                />
              </div>

              <motion.button
                onClick={createRoom}
                whileHover={!visitorName.trim() ? {} : { scale: 1.02 }}
                whileTap={!visitorName.trim() ? {} : { scale: 0.98 }}
                style={{
                  ...buttonPrimaryStyle,
                  marginBottom: '24px',
                  opacity: !visitorName.trim() ? 0.5 : 1,
                  cursor: !visitorName.trim() ? 'not-allowed' : 'pointer',
                }}
                disabled={!visitorName.trim()}
              >
                ➕ Créer une salle et appeler {ownerName}
              </motion.button>

              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}>
                  <div style={{
                    width: '100%',
                    borderTop: '1px solid #e5e7eb',
                  }} />
                </div>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}>
                  <span style={{
                    padding: '0 16px',
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                  }}>
                    ou
                  </span>
                </div>
              </div>

              <form onSubmit={joinRoom}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'block',
                    color: '#374151',
                    fontSize: '14px',
                    fontWeight: 600,
                    marginBottom: '8px',
                  }}>
                    ID de la salle (si {ownerName} vous l'a donné)
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Collez l'ID de la salle"
                    style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(99,102,241,0.3)'}
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={!(visitorName.trim() && roomId.trim()) ? {} : { scale: 1.02 }}
                  whileTap={!(visitorName.trim() && roomId.trim()) ? {} : { scale: 0.98 }}
                  style={{
                    ...buttonPrimaryStyle,
                    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                    opacity: !(visitorName.trim() && roomId.trim()) ? 0.5 : 1,
                    cursor: !(visitorName.trim() && roomId.trim()) ? 'not-allowed' : 'pointer',
                  }}
                  disabled={!visitorName.trim() || !roomId.trim()}
                >
                  🚪 Rejoindre la salle
                </motion.button>
              </form>

              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  ...buttonSecondaryStyle,
                  marginTop: '16px',
                }}
              >
                Annuler
              </motion.button>
            </div>
          ) : (
            <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
              <SocketProvider>
                <MediaProvider>
                  <VideoConference
                    roomId={roomId}
                    userName={visitorName}
                    onLeave={handleLeave}
                  />
                </MediaProvider>
              </SocketProvider>

              {/* Share room ID */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <code style={{
                    flex: 1,
                    backgroundColor: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #e5e7eb',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    color: '#1e293b',
                  }}>
                    {roomId}
                  </code>
                  <motion.button
                    onClick={copyRoomId}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: copied ? '#10b981' : '#6366f1',
                      color: '#ffffff',
                      borderRadius: 6,
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    {copied ? '✓ Copié!' : 'Copier'}
                  </motion.button>
                </div>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  marginTop: '8px',
                }}>
                  Partagez cet ID avec {ownerName} pour qu'il/elle rejoigne l'appel
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
