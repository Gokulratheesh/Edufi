
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const bodyParser = require('body-parser');
const pdfParse = require('pdf-parse');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API key
const GEMINI_API_KEY = 'YAIzaSyDj_w_SC9tOpjOvUiqJGTnf2kXf3l31MHs';
const GEMINI_API_URL = 'https://api.gemini.com/v1/ai/'; // Placeholder, replace with the actual Gemini API URL

// Function to load the PDF file and extract text from it
const loadPDF = (filePath) => {
    // Read the PDF file from the specified path
    const dataBuffer = fs.readFileSync(filePath);
    // Parse the PDF content to extract text
    return pdfParse(dataBuffer);
};

// Route to handle PDF processing and chatbot functionality
app.post('/chat', async (req, res) => {
    try {
        const userQuery = req.body.query;

        // Specify the path to your PDF file here
        // Replace 'your-pdf-file.pdf' with the actual file name or path to your PDF
        const pdfPath = req.body.pdfPath || `uploads/${Date.now()}errr.pdf`;

        // Extract text from the PDF using the loadPDF function
        const pdfData = await loadPDF(pdfPath);
        const pdfText = pdfData.text;

        // Send the extracted PDF text and the user's query to the Gemini API for processing
        const response = await axios.post(GEMINI_API_URL, {
            apiKey: GEMINI_API_KEY,
            text: pdfText,
            query: userQuery
        });

        // Process the Gemini API response
        const summary = response.data.summary;
        const answer = response.data.answer;

        // Send the summary and answer back to the client
        res.json({ summary, answer });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing request');
    }
});

// Simple home page
app.get('/', (req, res) => {
    res.send('Welcome to the PDF Chatbot!');
});

// Start the server on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
