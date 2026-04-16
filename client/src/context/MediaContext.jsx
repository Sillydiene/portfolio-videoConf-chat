import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useSocket } from "./SocketContext.jsx";

const MediaContext = createContext(null);

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMedia must be used within MediaProvider");
  }
  return context;
};

export const MediaProvider = ({ children }) => {
  const { socket } = useSocket();

  const [localStream, setLocalStream] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const roomIdRef = useRef(null);
  const peerConnections = useRef(new Map());
  const remoteStreams = useRef(new Map());

  const rtcConfig = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  const setRoomId = (roomId) => {
    roomIdRef.current = roomId;
  };

  const getMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error("Error accessing media devices:", error);
      throw error;
    }
  };

  const createPeerConnection = (userId, streamOverride = null) => {
    const pc = new RTCPeerConnection(rtcConfig);

    pc.onicecandidate = (event) => {
      if (!socket || !event.candidate) return;

      socket.emit("ice-candidate", {
        candidate: event.candidate,
        targetUserId: userId,
        roomId: roomIdRef.current,
      });
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        remoteStreams.current.set(userId, remoteStream);
        setParticipants((prev) => [...prev]);
      }
    };

    const streamToUse = streamOverride || localStream;
    if (streamToUse) {
      streamToUse.getTracks().forEach((track) => {
        pc.addTrack(track, streamToUse);
      });
    }

    return pc;
  };

  const toggleAudio = () => {
    if (!localStream || !socket) return;

    const audioTrack = localStream.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setAudioEnabled(audioTrack.enabled);

    if (roomIdRef.current) {
      socket.emit("toggle-audio", {
        roomId: roomIdRef.current,
        userId: socket.id,
        enabled: audioTrack.enabled,
      });
    }
  };

  const toggleVideo = () => {
    if (!localStream || !socket) return;

    const videoTrack = localStream.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setVideoEnabled(videoTrack.enabled);

    if (roomIdRef.current) {
      socket.emit("toggle-video", {
        roomId: roomIdRef.current,
        userId: socket.id,
        enabled: videoTrack.enabled,
      });
    }
  };

  const leaveRoom = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();
    remoteStreams.current.clear();

    setLocalStream(null);
    setParticipants([]);
    setAudioEnabled(true);
    setVideoEnabled(true);
    roomIdRef.current = null;
  };

  useEffect(() => {
    if (!socket) return;

    const handleRoomParticipants = (list) => {
      const others = list.filter((p) => p.id !== socket.id);
      setParticipants(others);
    };

    const handleUserJoined = async (user) => {
      setParticipants((prev) => {
        const exists = prev.some((p) => p.id === user.id);
        return exists ? prev : [...prev, user];
      });

      const currentStream = localStream;
      if (!currentStream) return;

      const existingPc = peerConnections.current.get(user.id);
      if (existingPc) {
        existingPc.close();
        peerConnections.current.delete(user.id);
      }

      const pc = createPeerConnection(user.id, currentStream);
      peerConnections.current.set(user.id, pc);

      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("offer", {
          offer: pc.localDescription,
          targetUserId: user.id,
          roomId: roomIdRef.current,
        });
      } catch (error) {
        console.error("Error creating offer:", error);
      }
    };

    const handleOffer = async ({ offer, fromUserId, targetUserId }) => {
      if (targetUserId && targetUserId !== socket.id) return;

      const currentStream = localStream;
      if (!currentStream) return;

      let pc = peerConnections.current.get(fromUserId);

      if (!pc) {
        pc = createPeerConnection(fromUserId, currentStream);
        peerConnections.current.set(fromUserId, pc);
      }

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer", {
          answer: pc.localDescription,
          targetUserId: fromUserId,
          roomId: roomIdRef.current,
        });
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    };

    const handleAnswer = async ({ answer, fromUserId, targetUserId }) => {
      if (targetUserId && targetUserId !== socket.id) return;

      const pc = peerConnections.current.get(fromUserId);
      if (!pc) return;

      try {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    };

    const handleIceCandidate = async ({ candidate, fromUserId, targetUserId }) => {
      if (targetUserId && targetUserId !== socket.id) return;

      const pc = peerConnections.current.get(fromUserId);
      if (!pc || !candidate) return;

      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error adding ICE candidate:", error);
      }
    };

    const handleUserLeft = (user) => {
      setParticipants((prev) => prev.filter((p) => p.id !== user.id));

      const pc = peerConnections.current.get(user.id);
      if (pc) {
        pc.close();
        peerConnections.current.delete(user.id);
      }

      remoteStreams.current.delete(user.id);
      setParticipants((prev) => [...prev]);
    };

    socket.on("room-participants", handleRoomParticipants);
    socket.on("user-joined", handleUserJoined);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("user-left", handleUserLeft);

    return () => {
      socket.off("room-participants", handleRoomParticipants);
      socket.off("user-joined", handleUserJoined);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("user-left", handleUserLeft);
    };
  }, [socket, localStream]);

  return (
      <MediaContext.Provider
          value={{
            localStream,
            participants,
            audioEnabled,
            videoEnabled,
            getMedia,
            toggleAudio,
            toggleVideo,
            leaveRoom,
            peerConnections,
            remoteStreams,
            setRoomId,
          }}
      >
        {children}
      </MediaContext.Provider>
  );
};