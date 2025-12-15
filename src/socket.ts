// src/socket.ts
import { io, Socket } from "socket.io-client";

type AnyObj = Record<string, any>;

const socket: Socket = io("http://localhost:4040", {
  autoConnect: false,
  transports: ["websocket"],
});

export function connectSocket(token?: string) {
  if (token) socket.auth = { token };
  if (!socket.connected) socket.connect();
}

export function disconnectSocket() {
  if (socket.connected) socket.disconnect();
}

export function joinRoom(roomId: string) {
  socket.emit("room:join", roomId);
}

export function leaveRoom(roomId: string) {
  socket.emit("room:leave", roomId);
}

export function sendMessage(payload: AnyObj) {
  socket.emit("message:send", payload);
}

export function startTyping(roomId: string) {
  socket.emit("typing:start", { roomId });
}

export function stopTyping(roomId: string) {
  socket.emit("typing:stop", { roomId });
}

export function markMessageRead(messageId: string, roomId: string) {
  socket.emit("message:read", { messageId, roomId });
}

export { socket };
