const express = require('express');
const qrcode = require('qrcode');
const cors = require('cors');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, './')));

// Function to get Local IP Address
function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

const LOCAL_IP = getLocalIp();
const SERVER_URL = `http://${LOCAL_IP}:${PORT}`;

// Endpoint to get QR URL
app.get('/api/get-qr', (req, res) => {
    res.json({ url: SERVER_URL });
});

app.listen(PORT, () => {
    console.log(`-------------------------------------------------`);
    console.log(`🚀 Resort Server running at: ${SERVER_URL}`);
    console.log(`📱 Scan the QR code on the landing page with your phone!`);
    console.log(`-------------------------------------------------`);
});

module.exports = app;
