import { useState } from 'react';
import { useMedia } from '../../context/MediaContext.jsx';

export default function Controls({ onLeave }) {
  const { toggleAudio, toggleVideo, audioEnabled, videoEnabled } = useMedia();

  return (
    <div style={{
      backgroundColor: '#111827',
      padding: '16px',
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
    }}>
      <motion.button
        onClick={toggleAudio}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: 10,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          backgroundColor: audioEnabled ? '#374151' : '#dc2626',
          color: '#ffffff',
          fontSize: 15,
          fontFamily: 'inherit',
        }}
      >
        {audioEnabled ? '🎤' : '🔇'}
        {audioEnabled ? 'Couper' : 'Activer'} le son
      </motion.button>

      <motion.button
        onClick={toggleVideo}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: 10,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          backgroundColor: videoEnabled ? '#374151' : '#dc2626',
          color: '#ffffff',
          fontSize: 15,
          fontFamily: 'inherit',
        }}
      >
        {videoEnabled ? '📹' : '📷'}
        {videoEnabled ? 'Désactiver' : 'Activer'} la vidéo
      </motion.button>

      <motion.button
        onClick={onLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 24px',
          borderRadius: 10,
          fontWeight: 600,
          border: 'none',
          cursor: 'pointer',
          backgroundColor: '#dc2626',
          color: '#ffffff',
          fontSize: 15,
          fontFamily: 'inherit',
        }}
      >
        📞 Quitter
      </motion.button>
    </div>
  );
}

// Import motion if not already imported
import { motion } from 'framer-motion';
