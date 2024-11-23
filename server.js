const express = require('express');
const app = express();
const port = 8080;

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to validate card
app.post('/api/card_reader/validate_card', (req, res) => {
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
