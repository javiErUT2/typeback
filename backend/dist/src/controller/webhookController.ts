import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;

export const postWebhook = async (req: Request, res: Response) => {
  const bodyJSON = JSON.stringify(req.body, null, 2);
  const message = req.body["entry"][0]["changes"][0]["value"]["messages"];
  console.log(message);

  if (message) {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  }
  res.sendStatus(200);
};

export const getWebhook = (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { to, text } = req.body;
    const apiUrl = 'https://graph.facebook.com/v18.0/255264754344614/messages';

    const requestBody = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: 9983487842,
      type: 'text',
      text: {
        preview_url: false,
        body: text
      }
    };

    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      }
    });

    console.log(response.data);
    res.status(200).json({ success: true, message: 'Mensaje enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el mensaje' });
  }
};
