import express from "express";
import dotenv from "dotenv";
import webhookRoutes from "./routes/webhookRoutes";

dotenv.config();  // Asegúrate de que esta línea esté presente y se ejecute antes de acceder a cualquier variable de entorno

const app = express();
app.use(express.json());

app.use("/", webhookRoutes);

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

export default app;
