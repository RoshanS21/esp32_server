const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Load self-signed certificate
const options = {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
};

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

// Helper function to log data to a file and terminal
const logToFile = (filename, data) => {
    const logEntry = `${new Date().toISOString()} - ${JSON.stringify(data)}`;
    console.log(logEntry); // Output to terminal
    fs.appendFileSync(filename, logEntry + '\n', 'utf8'); // Append to file
};

// Helper function to validate request payloads
const validatePayload = (fields, payload) => {
    for (const field of fields) {
        if (!payload[field]) {
            return `Missing required field: ${field}`;
        }
    }
    return null;
};

// Endpoint to validate card
app.post('/api/card_reader/validate_card', authorize, (req, res) => {
    const requiredFields = ['cardID', 'readerID', 'timestamp'];
    const validationError = validatePayload(requiredFields, req.body);

    if (validationError) {
        console.log(`[Validation Error] ${validationError}`);
        return res.status(400).json({ message: validationError });
    }

    const { cardID, readerID, timestamp } = req.body;

    // Log received data
    console.log(`[Card Validation Request] cardID: ${cardID}, readerID: ${readerID}, timestamp: ${timestamp}`);

    // Always grant access for now
    const response = {
        readerID,
        accessGranted: true
    };

    // Log access attempt
    logToFile('access_logs.txt', { cardID, readerID, timestamp, accessGranted: true });

    res.status(200).json(response);
});

// Endpoint to log access attempts
app.post('/api/card_reader/log_access', (req, res) => {
    const requiredFields = ['cardID', 'readerID', 'timestamp', 'accessGranted'];
    const validationError = validatePayload(requiredFields, req.body);

    if (validationError) {
        console.log(`[Validation Error] ${validationError}`);
        return res.status(400).json({ message: validationError });
    }

    const { cardID, readerID, timestamp, accessGranted } = req.body;

    // Log access attempt
    console.log(`[Access Log] cardID: ${cardID}, readerID: ${readerID}, timestamp: ${timestamp}, accessGranted: ${accessGranted}`);
    logToFile('access_logs.txt', { cardID, readerID, timestamp, accessGranted });

    res.status(200).json({ status: "success" });
});

// Endpoint to log door state changes
app.post('/api/card_reader/log_door_state', (req, res) => {
    const requiredFields = ['readerID', 'timestamp', 'doorState'];
    const validationError = validatePayload(requiredFields, req.body);

    if (validationError) {
        console.log(`[Validation Error] ${validationError}`);
        return res.status(400).json({ message: validationError });
    }

    const { readerID, timestamp, doorState } = req.body;

    // Log door state change
    console.log(`[Door State Change] readerID: ${readerID}, timestamp: ${timestamp}, doorState: ${doorState}`);
    logToFile('door_state_logs.txt', { readerID, timestamp, doorState });

    res.status(200).json({ status: "success" });
});

// Start the server with HTTPS
https.createServer(options, app).listen(port, () => {
    console.log(`[Server Start] HTTPS server running at https://localhost:${port}`);
});
