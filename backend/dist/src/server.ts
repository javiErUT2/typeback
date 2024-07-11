import { server } from "./db/socketServer";
import app from "./app";

const { PORT } = process.env;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
