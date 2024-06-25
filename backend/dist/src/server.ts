import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import mysql from 'mysql2/promise';
import path from 'path'; // Importa el módulo path

const dbConfig = {
    host: "localhost",
    user: "root",
    password: "",  
    database: "VCMessage"
};

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
const io = new Server(server, { /* opciones */ });

// Servir archivos estáticos desde la carpeta 'backend'
app.use(express.static(path.join(__dirname, '../')));

// Conectar a la base de datos al inicio del servidor
(async () => {
    try {
        await connectToDatabase();
    } catch (error) {
        console.error("No se pudo conectar a la base de datos al inicio del servidor:", error);
        process.exit(1); // Salir del proceso si la conexión falla
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
            const connection = await connectToDatabase();
            const query = 'INSERT INTO chat_users (chat_id, user_id, message) VALUES (?, ?, ?)';
            const [result] = await connection.execute(query, [2 /* chat_id aquí */, 2 /* user_id aquí */, data /* contenido del mensaje */]);
            console.log("Mensaje insertado correctamente en la base de datos");
            await connection.end();
        } catch (error) {
            console.error("Error al ejecutar la consulta:", error);
        }
    });
    
    
    socket.on("disconnect", () => {
        console.log("Cliente desconectado");
    });
});

// Ruta para servir tu página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

server.listen(3000, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
