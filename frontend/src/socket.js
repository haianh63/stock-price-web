import { io } from "socket.io-client";
import { BASE_URL } from "../utils/constants";

export const socket = io(BASE_URL);
