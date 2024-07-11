"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)("http://localhost:3000");
socket.on("noArg", () => {
    console.log("Evento noArg recibido");
});
socket.on("basicEmit", (a, b, c) => {
    console.log("Evento basicEmit recibido", a, b, c);
});
socket.on("withAck", (d, callback) => {
    console.log("Evento withAck recibido", d);
    callback(123);
});
socket.emit("mensaje", "Este es un mensaje desde el cliente");
