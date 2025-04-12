const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Validate API key on startup
if (!process.env.OPENWEATHER_API_KEY) {
    console.error('ERROR: OpenWeather API key is missing! Please check your .env file.');
    process.exit(1);
}

// Configure CORS to allow requests from the client
app.use(cors());

app.use(express.json());

// Test endpoint to verify server is running
app.get('/ping', (req, res) => {
    res.json({ message: 'Server is running!' });
});

app.get('/api/weather', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: 'City parameter is required' });
        }

        console.log('Fetching weather for city:', city);
        
        // Test the API key first
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
            );
            
            console.log('Weather data received:', response.data);
            res.json(response.data);
        } catch (apiError) {
            console.error('OpenWeather API Error:', {
                message: apiError.message,
                response: apiError.response?.data,
                status: apiError.response?.status
            });

            if (apiError.response?.status === 401) {
                res.status(500).json({ error: 'Invalid API key. Please check server configuration.' });
            } else if (apiError.response?.status === 404) {
                res.status(404).json({ error: 'City not found. Please check the city name.' });
            } else {
                throw apiError; // Let the outer catch handle other errors
            }
        }
    } catch (error) {
        console.error('Server Error:', {
            message: error.message,
            stack: error.stack
        });

        res.status(500).json({ 
            error: 'Failed to fetch weather data. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Listen on all available network interfaces
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('API Key status:', process.env.OPENWEATHER_API_KEY ? 'Present' : 'Missing');
});
