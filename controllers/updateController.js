const axios = require('axios');
const Coin = require('../models/Coin');
const { calculateStandardDeviation } = require('../utils/calculateStandardDeviation');
const dotenv = require('dotenv');
dotenv.config();
const COIN_ID_TYPES = ['bitcoin', 'matic-network', 'ethereum'];
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

//  latest stats for a specified curency type
const getStats = async (req, res) => {
    const { coin_id_type } = req.query;

    if (!COIN_ID_TYPES.includes(coin_id_type)) {
        return res.status(400).json({ error: 'Invalid coin type specified' });
    }

    try {
        const latestRecord = await Coin.findOne({ coinId: coin_id_type }).sort({ createdAt: -1 });
        if (!latestRecord) {
            return res.status(404).json({ error: 'No data found for the requested coin type' });
        }

        res.json({
            price: latestRecord.price,
            marketCap: latestRecord.marketCap,
            '24hChange': latestRecord.change24h,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// calculate standard deviation of the last 100 price records of specified currency type using utility func
const getDeviation = async (req, res) => {
    const { coin_id_type } = req.query;

    if (!COIN_ID_TYPES.includes(coin_id_type)) {
        return res.status(400).json({ error: 'Invalid coin type specified' });
    }

    try {
        const records = await Coin.find({ coinId: coin_id_type }).sort({ createdAt: -1 }).limit(100);
        if (records.length === 0) {
            return res.status(404).json({ error: 'No data found for the requested coin type' });
        }

        const prices = records.map((record) => record.price);
        const deviation = calculateStandardDeviation(prices);

        res.json({ deviation });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = { getStats, getDeviation, fetchAndStoreCryptoData };
