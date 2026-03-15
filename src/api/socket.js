import { io } from "socket.io-client";

let socket = null;

export function connectSocket() {
  if (socket?.connected) return socket;

  // Token stored in localStorage after login (since cookie is httpOnly)
  const token = localStorage.getItem("accessToken");
  console.log("TOKEN FROM STORAGE:", token);

  const BASE =
    import.meta.env.VITE_API_BASE_URL
      ?.replace("/api/v1", "")
      .replace("/api", "") || "http://localhost:5000";

  socket = io(BASE, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

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
  }
}