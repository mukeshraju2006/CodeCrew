import { io } from "socket.io-client";

let socket = null;
let connectedToken = null;

export function connectSocket() {
  const token = localStorage.getItem("accessToken");

  // If socket exists but token changed (different user logged in), disconnect first
  if (socket && connectedToken !== token) {
    socket.disconnect();
    socket = null;
    connectedToken = null;
  }

  if (socket?.connected) return socket;

  const BASE =
    import.meta.env.VITE_API_BASE_URL
      ?.replace("/api/v1", "")
      .replace("/api", "") || "http://localhost:5000";

  socket = io(BASE, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  connectedToken = token;

  socket.on("connect",       () => console.log("Socket connected:", socket.id));
  socket.on("connect_error", (e) => console.error("Socket error:", e.message));

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    connectedToken = null;
  }
}