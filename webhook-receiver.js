const express = require('express');
const crypto = require('crypto');
const app = express();

const SECRET = 'mySuperSecretKey';

app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    }
}));

app.post('/receive-webhook', (req, res) => {
    const receivedSignature = req.headers['x-hub-signature'];

    const expectedSignature = `sha256=${crypto.createHmac('sha256', SECRET).update(req.rawBody).digest('hex')}`;

    console.log(`Expected Signature: ${expectedSignature}`);
    console.log(`Received Signature: ${receivedSignature}`);

    if (!receivedSignature || receivedSignature !== expectedSignature) {
        console.error('Signature mismatch! Webhook rejected.');
        return res.status(401).json({ message: 'Invalid signature' });
    }

    console.log('Verified webhook:', req.body);
    res.json({ message: 'Webhook received successfully!' });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Secure Webhook Receiver running on http://localhost:${PORT}`));
