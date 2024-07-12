import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import mysql, { Connection } from 'mysql2/promise';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "VCMessage"
};

let dbConnection: Connection;

async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("Conectado a la base de datos MySQL");
        return connection;
    } catch (error) {
        console.error("Error al conectar a la base de datos MySQL:", error);
        throw error;
    }
}

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../../')));

(async () => {
    try {
        dbConnection = await connectToDatabase();
    } catch (error) {
        console.error("No se pudo conectar a la base de datos al inicio del servidor:", error);
        process.exit(1);
    }
})();

io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on("error", (err) => {
        console.error("Error en el socket:", err);
    });

    socket.on("mensaje", async (data) => {
        console.log("Mensaje recibido:", data);
        try {
            const query = 'INSERT INTO chat_users (chat_id, user_id, message) VALUES (?, ?, ?)';
            const [result] = await dbConnection.execute(query, [1, 1, data]);
            console.log("Mensaje insertado correctamente en la base de datos");
            io.emit("mensaje", data);
        } catch (error) {
            console.error("Error al ejecutar la consulta:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

export { server, app };
