


import dotenv from 'dotenv';
import express from "express";
import cors from 'cors';
import { connect } from "./src/config/DB.js";
import pkg from "whatsapp-web.js";
import multer from 'multer';
import invoiceRouter from "./src/routers/invoicerouter.js";
import qrcode from 'qrcode';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import qrcodeTerminal from 'qrcode-terminal';

dotenv.config();

const { Client, LocalAuth } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

await connect();

// Upload setup
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, "uploads/"),
        filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
    })
});

app.use("/uploads", express.static("uploads"));

// Session folder
const sessionsDir = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true });
}

// Global state
let client;
let isInitializing = false;
let clientReady = false;
let qrCodeData = null;

// Create client
const createClient = () => {
    return new Client({
        authStrategy: new LocalAuth({
            clientId: process.env.CLIENT_ID || 'render-client',
            dataPath: sessionsDir
        }),
        puppeteer: {
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--no-zygote",
                "--single-process"
            ]
        }
    });
};

// Initialize ONLY ONCE
const initializeClient = async () => {
    if (isInitializing || client) return;

    try {
        isInitializing = true;
        console.log("Initializing WhatsApp...");

        client = createClient();

        client.on('qr', async (qr) => {
            console.log("📱 Scan this QR:");

            // ✅ This prints actual QR in terminal
            qrcodeTerminal.generate(qr, { small: true });

            // Optional (for frontend)
            qrCodeData = await qrcode.toDataURL(qr);
        });

        client.on('ready', () => {
            console.log("WhatsApp Ready ✅");
            clientReady = true;
            qrCodeData = null;
        });

        client.on('authenticated', () => {
            console.log("Authenticated ✅");
        });

        client.on('disconnected', async (reason) => {
            console.log("Disconnected:", reason);
            clientReady = false;
            client = null;
            isInitializing = false;

            setTimeout(() => initializeClient(), 10000);
        });

        client.on('message', async (msg) => {
            console.log("Message received");
        });

        client.on('message_create', async (message) => {
            if (message.fromMe) {
                console.log(`📤 You sent: ${message.body}`);
            }
        });

        await client.initialize();

    } catch (err) {
        console.error("Init error:", err);
        client = null;
        isInitializing = false;

        setTimeout(() => initializeClient(), 15000);
    }
};

initializeClient();



export default client;

// Routes
app.get("/", (req, res) => {
    res.send("Server running...");
});

app.get("/api/whatsapp/status", (req, res) => {
    res.json({
        ready: clientReady,
        qrCode: qrCodeData
    });
});

app.use("/api/invoice", invoiceRouter);

// Start server
app.listen(3018, () => {
    console.log("Server started on port 3018");
});
