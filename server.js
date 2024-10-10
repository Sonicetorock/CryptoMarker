const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const { DBConnection } = require('./config/db');
const { startBackgroundJob } = require('./backgroundJobs/FetchData_Every2Hr');
const updateRoutes = require('./routes/updateRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server up and running');
});

// Health checking for the CoinGecko API
app.get('/ping', (req, res) => {
    res.json({ status: 'CoinGeckoAPI server is good and servicing' });
});


app.use('/', updateRoutes);

//runs for every 2 hours after server ignition
startBackgroundJob();


// server ignition
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ignited on port ${PORT}`);
    DBConnection();
});