import { io } from "socket.io-client";
import { WS_BASE_URL } from "../utils/constants";

export const socket = io(WS_BASE_URL, {
  transports: ["websocket", "polling"], // Cho phép fallback sang polling
  withCredentials: false,
  timeout: 20000, // Timeout 20s
  forceNew: true, // Tạo connection mới
  reconnection: true, // Bật auto reconnect
  reconnectionDelay: 1000, // Delay 1s trước khi reconnect
  reconnectionAttempts: 5, // Thử reconnect 5 lần
  maxReconnectionAttempts: 10,
  upgrade: true, // Cho phép upgrade từ polling lên websocket
  autoConnect: true,
});
