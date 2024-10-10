const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server up and running');
});

// server ignition
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server ignited on port ${PORT}`);
});