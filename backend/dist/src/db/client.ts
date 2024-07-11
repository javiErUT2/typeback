import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    mensaje: (data: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000");

socket.on("noArg", () => {
    console.log("Evento noArg recibido");
});

socket.on("basicEmit", (a: number, b: string, c: Buffer) => {
    console.log("Evento basicEmit recibido", a, b, c);
});

socket.on("withAck", (d: string, callback: (e: number) => void) => {
    console.log("Evento withAck recibido", d);
    callback(123);
});

socket.emit("mensaje", "Este es un mensaje desde el cliente");
