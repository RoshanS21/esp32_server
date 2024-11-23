const express = require('express');
const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Helper function to decode Base64
const decodeBase64 = (str) => Buffer.from(str, 'base64').toString('utf-8');

// Middleware to check authorization
const authorize = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const auth = authHeader.split(' ')[1];
        const decodedAuth = decodeBase64(auth);
        const [username, password] = decodedAuth.split(':');

        // Verify username and password
        if (username === 'cardReader' && password === 'readerPass') {
            next(); // Authorized, proceed to the next middleware
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        res.status(401).json({ message: 'Authorization header missing' });
    }
};

// Endpoint to validate card with authorization middleware
app.post('/api/card_reader/validate_card', authorize, (req, res) => {
    const { cardID, readerID } = req.body;

    // Log received data
    console.log(`Received cardID: ${cardID}, readerID: ${readerID}`);

    // Simulated validation logic
    if (cardID === "72e0d200" && readerID === "IndalaReader1") {
        res.status(200).json({ message: "Card authorized", status: "success" });
    } else {
        res.status(403).json({ message: "Card not authorized", status: "failure" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
