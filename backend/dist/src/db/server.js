"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const promise_1 = __importDefault(require("mysql2/promise"));
const path_1 = __importDefault(require("path")); // Importa el módulo path
const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",
    database: "VCMessage"
};
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield promise_1.default.createConnection(dbConfig);
            console.log("Conectado a la base de datos MySQL");
            return connection;
        }
        catch (error) {
            console.error("Error al conectar a la base de datos MySQL:", error);
            throw error;
        }
    });
}
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { /* opciones */});
// Servir archivos estáticos desde la carpeta 'backend'
app.use(express_1.default.static(path_1.default.join(__dirname, '../')));
// Conectar a la base de datos al inicio del servidor
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToDatabase();
    }
    catch (error) {
        console.error("No se pudo conectar a la base de datos al inicio del servidor:", error);
        process.exit(1); // Salir del proceso si la conexión falla
    }
}))();
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");
    socket.on("error", (err) => {
        console.error("Error en el socket:", err);
    });
    socket.on("mensaje", (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Mensaje recibido:", data);
        try {
            const connection = yield connectToDatabase();
            const query = 'INSERT INTO chat_users (chat_id, created_at, user_id) VALUES (?, NOW(), ?)';
            const [result] = yield connection.execute(query, [1 /* chat_id aquí */, 1 /* user_id aquí */]); // Reemplaza los valores con los correctos
            console.log("Mensaje insertado correctamente en la base de datos");
            // Emitir el mensaje de vuelta al cliente
            io.emit("mensaje", data); // Envía el mensaje a todos los clientes conectados
            yield connection.end();
        }
        catch (error) {
            console.error("Error al ejecutar la consulta:", error);
        }
    }));
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});
// Ruta para servir tu página HTML
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../index.html'));
});
server.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3001");
});
