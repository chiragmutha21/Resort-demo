const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, './')));

// Endpoint to get QR URL - Dynamic for any environment (Vercel, Local, etc.)
app.get('/api/get-qr', (req, res) => {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const SERVER_URL = `${protocol}://${host}?mode=dashboard`;
    res.json({ url: SERVER_URL });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;

