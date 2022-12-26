import { ClientToServerEvents, ServerToClientEvents } from "@jatsi/engine";
import { Socket } from "socket.io";

export type ServerSocket = Socket<ClientToServerEvents, ServerToClientEvents>
