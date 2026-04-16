import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }

  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "http://127.0.0.1:3001";

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
    });

    socketInstance.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, [SOCKET_URL]);

  return (
      <SocketContext.Provider value={{ socket, connected }}>
        {children}
      </SocketContext.Provider>
  );
};