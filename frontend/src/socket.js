import { io } from "socket.io-client";
import { WS_BASE_URL } from "../utils/constants";

export const socket = io(WS_BASE_URL);
