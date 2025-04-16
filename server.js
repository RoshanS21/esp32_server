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

        // Log authorization attempt
        console.log(`[Authorization Attempt] Username: ${username}`);

        // Verify username and password
        if (username === 'cardReader' && password === 'readerPass') {
            console.log(`[Authorization Success] Username: ${username}`);
            next(); // Authorized, proceed to the next middleware
        } else {
            console.log(`[Authorization Failure] Invalid credentials for Username: ${username}`);
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        console.log(`[Authorization Failure] Authorization header missing`);
        res.status(401).json({ message: 'Authorization header missing' });
    }
};

// Array of valid card IDs
const validCardIDs = ["773e8000", "72e0d200"];

// Endpoint to validate card with authorization middleware
app.post('/api/card_reader/validate_card', authorize, (req, res) => {
    const { cardID, readerID } = req.body;

    // Log received data with date and time
    const currentDate = new Date();
    console.log(`[Card Validation Request] [${currentDate}] cardID: ${cardID}, readerID: ${readerID}`);

    // Set Content-Type header
    res.setHeader('Content-Type', 'application/json');

    // Always authorize the card
    console.log(`[Card Validation Success] cardID: ${cardID} authorized`);
    res.status(200).json({ message: "Card authorized", status: "success" });
});

// Start the server
app.listen(port, () => {
    console.log(`[Server Start] Server running at http://localhost:${port}`);
});
