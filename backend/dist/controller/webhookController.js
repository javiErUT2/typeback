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
exports.sendMessage = exports.getWebhook = exports.postWebhook = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN } = process.env;
const postWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bodyJSON = JSON.stringify(req.body, null, 2);
    const message = req.body["entry"][0]["changes"][0]["value"]["messages"];
    console.log(message);
    if (message) {
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    }
    res.sendStatus(200);
});
exports.postWebhook = postWebhook;
const getWebhook = (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
        res.status(200).send(challenge);
        console.log("Webhook verified successfully!");
    }
    else {
        res.sendStatus(403);
    }
};
exports.getWebhook = getWebhook;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { to, text } = req.body;
        const apiUrl = 'https://graph.facebook.com/v18.0/255264754344614/messages';
        const requestBody = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to,
            type: 'text',
            text: {
                preview_url: false,
                body: text
            }
        };
        const response = yield axios_1.default.post(apiUrl, requestBody, {
            headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            }
        });
        console.log(response.data);
        res.status(200).json({ success: true, message: 'Mensaje enviado exitosamente' });
    }
    catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el mensaje' });
    }
});
exports.sendMessage = sendMessage;
