import { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext.jsx';

export default function Chat({ roomId, isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [socket, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit('chat-message', {
      roomId,
      message: newMessage,
      userId: socket.id,
      userName: 'Visiteur'
    });
    setNewMessage('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      height: '100vh',
      width: '320px',
      backgroundColor: '#ffffff',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      zIndex: 50,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{ fontWeight: 600 }}>Discussion</h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            fontSize: 20,
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              padding: '12px',
              borderRadius: 8,
              backgroundColor: msg.userId === socket.id ? '#e0e7ff' : '#f3f4f6',
              marginLeft: msg.userId === socket.id ? '32px' : 0,
              marginRight: msg.userId !== socket.id ? '32px' : 0,
            }}
          >
            <div style={{ fontSize: '12px', color: '#4b5563', fontWeight: 600, marginBottom: '4px' }}>
              {msg.userName}
            </div>
            <div style={{ fontSize: '14px', color: '#1e293b' }}>
              {msg.message}
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrire un message..."
            style={{
              flex: 1,
              padding: '10px 14px',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              outline: 'none',
              fontSize: 14,
              fontFamily: 'inherit',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
}
