const express = require('express');
const { getStats, getDeviation } = require('../controllers/updateController');

const router = express.Router();

// Stats
//params :  currency type
router.get('/stats', getStats);

// Fetching Deviations
//params : currency type
router.get('/deviation', getDeviation);

module.exports = router;
