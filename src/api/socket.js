import { io } from "socket.io-client";

let socket = null;
let connectedToken = null;

const BACKEND_URL = "https://nullchapter-backend.onrender.com";

export function connectSocket() {
  const token = localStorage.getItem("accessToken");

  // If token changed (new user logged in), disconnect old socket first
  if (socket && connectedToken !== token) {
    socket.disconnect();
    socket = null;
    connectedToken = null;
  }

  if (socket?.connected) return socket;

  socket = io(BACKEND_URL, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  connectedToken = token;

  socket.on("connect", () => console.log("Socket connected:", socket.id));
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