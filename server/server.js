import dotenv from 'dotenv';
import express from "express"
import cors from 'cors'
import { connect } from "./src/config/DB.js"
import pkg from "whatsapp-web.js";
import multer from 'multer';
import invoiceRouter from "./src/routers/invoicerouter.js"
import qrcode from 'qrcode';
import qrcodeTerminal from 'qrcode-terminal';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client, LocalAuth, MessageMedia, RemoteAuth } = pkg;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors("*"))

// mongoDB connecting
const isConnected = await connect()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

const sessionsDir = path.join(__dirname, 'sessions');
if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true });
}

// Global variables
let qrCodeData = null;
let clientReady = false;
let client = null;
let restartTimeout = null;
let isShuttingDown = false;

// Function to clear terminal (works on most terminals)
const clearTerminal = () => {
    console.clear();
    console.log('🚀 WhatsApp Bot Starting...');
    console.log('='.repeat(50));
};

const createClient = () => {
    console.log("create client ");
    return new Client({
        authStrategy: new LocalAuth({
            clientId: process.env.CLIENT_ID || 'render-client-cc',
            dataPath: sessionsDir
        }),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-web-security',
                '--disable-features=VizDisplayCompositor',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
                '--single-process'
            ],
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
        },
        webVersionCache: {
            type: 'remote',
            remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
        }
    });
};

const cleanupClient = () => {
    if (restartTimeout) {
        clearTimeout(restartTimeout);
        restartTimeout = null;
    }

    if (client) {
        client.removeAllListeners();
        try {
            client.destroy();
        } catch (error) {
            console.error('Error destroying client:', error);
        }
        client = null;
    }
};

const initializeClient = async () => {
    if (isShuttingDown) return;

    try {
        cleanupClient();

        client = createClient();

        client.on('qr', async (qr) => {
            clearTerminal();
            console.log('📱 NEW QR CODE RECEIVED');
            console.log('='.repeat(50));
            console.log('🔍 SCAN THIS QR CODE WITH YOUR WHATSAPP APP');
            console.log('📱 Open WhatsApp → Settings → Linked Devices → Link a Device');
            console.log('='.repeat(50));

            // Display QR code in terminal
            qrcodeTerminal.generate(qr, { small: true });
            console.log('='.repeat(50));
            console.log('⏳ Waiting for you to scan the QR code...');
            console.log('💡 The QR code will refresh automatically if needed');
            console.log('='.repeat(50));

            try {
                // Generate QR code as data URL for web display
                qrCodeData = await qrcode.toDataURL(qr);
                console.log('✅ QR Code also available at: https://cc-invoice-api.onrender.com/qr');
            } catch (error) {
                console.error('❌ Error generating QR code for web:', error);
            }
        });

        client.on('ready', () => {
            clearTerminal();
            console.log('🎉 WHATSAPP CONNECTED SUCCESSFULLY!');
            console.log('='.repeat(50));
            console.log('✅ Bot is now ready to receive messages');
            console.log('📱 You can send "ping" or "status" to test the bot');
            console.log('🌐 Web interface: https://cc-invoice-api.onrender.com/qr');
            console.log('='.repeat(50));
            clientReady = true;
            qrCodeData = null;
        });

        client.on('authenticated', () => {
            console.log('WhatsApp client authenticated');
            qrCodeData = null;
        });

        client.on('auth_failure', (msg) => {
            console.error('Authentication failed:', msg);
            clientReady = false;
        });

        client.on('disconnected', (reason) => {
            console.log('WhatsApp client disconnected:', reason);
            clientReady = false;

            if (!isShuttingDown) {
                restartTimeout = setTimeout(() => {
                    console.log('Attempting to restart WhatsApp client...');
                    initializeClient();
                }, 10000);
            }
        });

        client.on('message', async (message) => {
            try {
                console.log(`Message recevied ✅ `);


            } catch (error) {
                console.error('Error handling message:', error);
            }
        });

        client.on('error', (error) => {
            console.error('WhatsApp client error:', error);
        });

        await client.initialize();

    } catch (error) {
        console.error('Failed to initialize client:', error);
        if (!isShuttingDown) {
            restartTimeout = setTimeout(() => {
                console.log('Retrying client initialization...');
                initializeClient();
            }, 15000);
        }
    }
};

// Graceful shutdown handling
const gracefulShutdown = async (signal) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
    isShuttingDown = true;

    cleanupClient();

    // Close server
    if (server) {
        server.close(() => {
            console.log('HTTP server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Initialize client
initializeClient();

export default client

app.get("/", (req, res) => {
    res.send("Server is running...");
    console.log("test")
});

// QR Code display page
app.get("/qr", (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>WhatsApp QR Code</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
                background-color: #f0f0f0;
            }
            .container {
                max-width: 500px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .qr-container {
                margin: 20px 0;
            }
            .status {
                padding: 10px;
                border-radius: 5px;
                margin: 10px 0;
            }
            .ready { background-color: #d4edda; color: #155724; }
            .waiting { background-color: #fff3cd; color: #856404; }
            .error { background-color: #f8d7da; color: #721c24; }
            button {
                background-color: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin: 5px;
            }
            button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>WhatsApp QR Code</h1>
            <div id="status" class="status waiting">Checking status...</div>
            <div class="qr-container" id="qrContainer">
                <p>Loading QR code...</p>
            </div>
            <button onclick="checkStatus()">Refresh Status</button>
            <button onclick="location.reload()">Reload Page</button>
        </div>

        <script>
            function checkStatus() {
                fetch('/api/whatsapp/status')
                    .then(response => response.json())
                    .then(data => {
                        const statusDiv = document.getElementById('status');
                        const qrContainer = document.getElementById('qrContainer');
                        
                        if (data.ready) {
                            statusDiv.className = 'status ready';
                            statusDiv.textContent = '✅ WhatsApp is connected and ready!';
                            qrContainer.innerHTML = '<p>WhatsApp is authenticated and ready to use.</p>';
                        } else if (data.qrCode) {
                            statusDiv.className = 'status waiting';
                            statusDiv.textContent = '📱 Please scan the QR code with WhatsApp';
                            qrContainer.innerHTML = \`<img src="\${data.qrCode}" alt="WhatsApp QR Code" style="max-width: 300px;">\`;
                        } else {
                            statusDiv.className = 'status error';
                            statusDiv.textContent = '❌ Waiting for QR code...';
                            qrContainer.innerHTML = '<p>Waiting for WhatsApp to generate QR code...</p>';
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        document.getElementById('status').className = 'status error';
                        document.getElementById('status').textContent = '❌ Error checking status';
                    });
            }

            // Check status immediately and every 5 seconds
            checkStatus();
            setInterval(checkStatus, 5000);
        </script>
    </body>
    </html>
    `;
    res.send(html);
});

// WhatsApp status endpoint
app.get("/api/whatsapp/status", (req, res) => {
    res.json({
        ready: clientReady,
        qrCode: qrCodeData,
        uptime: Math.floor(process.uptime())
    });
});

// router
app.use("/api/invoice", invoiceRouter)

const server = app.listen(3018, () => {
    console.log("server started on port 3018")
});

