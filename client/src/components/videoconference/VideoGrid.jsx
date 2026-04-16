import { useRef, useEffect } from 'react';

export default function VideoGrid({ localStream, participants, peerConnections, remoteStreams }) {
  const localVideoRef = useRef(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
      padding: '16px',
    }}>
      {/* Local video */}
      <div style={{
        position: 'relative',
        backgroundColor: '#1f2937',
        borderRadius: 12,
        overflow: 'hidden',
        aspectRatio: '16/9',
      }}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '4px 12px',
          borderRadius: 6,
          color: '#ffffff',
          fontSize: '14px',
        }}>
          Moi
        </div>
      </div>

      {/* Remote videos */}
      {participants.map((participant) => {
        const stream = remoteStreams.current.get(participant.id);
        return (
          <div
            key={participant.id}
            style={{
              position: 'relative',
              backgroundColor: '#1f2937',
              borderRadius: 12,
              overflow: 'hidden',
              aspectRatio: '16/9',
            }}
          >
            <VideoElement stream={stream} participant={participant} />
          </div>
        );
      })}
    </div>
  );
}

function VideoElement({ stream, participant }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: '4px 12px',
        borderRadius: 6,
        color: '#ffffff',
        fontSize: '14px',
      }}>
        {participant.name}
      </div>
    </>
  );
}
