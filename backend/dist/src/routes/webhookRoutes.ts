import { Router } from "express";
import { postWebhook, getWebhook, sendMessage } from "../controller/webhookController";

const router = Router();

router.post("/webhook", postWebhook);
router.get("/webhook", getWebhook);
router.post("/send", sendMessage);

export default router;
