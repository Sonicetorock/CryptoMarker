const axios = require('axios');
const Coin = require('../models/Coin');
const { calculateStandardDeviation } = require('../utils/calculateStandardDeviation');
const dotenv = require('dotenv');
dotenv.config();
const COIN_ID_TYPES = ['bitcoin', 'matic-network', 'ethereum'];
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';

// fftching cryptocurrency data from the CoinGecko API
const fetchCryptoData = async () => {
    try {
        const response = await axios.get(COINGECKO_API_URL, {
            params: {
                x_cg_api_key: process.env.COINGECKO_API_KEY,
                ids: COIN_ID_TYPES.join(','),
                vs_currencies: 'usd',
                include_market_cap: true,
                include_24hr_change: true,
            },
        });

        return response.data;
    } catch (err) {
        console.error('Error fetching cryptocurrency data:', err.message);
        throw new Error('API request failed');
    }
};

// Storing currency data to our database
const saveCoinData = async (coinId, coinData) => {
    const newCoin = new Coin({
        coinId,
        price: coinData.usd,
        marketCap: coinData.usd_market_cap,
        change24h: coinData.usd_24h_change,
    });
    await newCoin.save();
};

// job function to fetch and store the data
const fetchAndStoreCryptoData = async () => {
    try {
        const data = await fetchCryptoData();
        for (const coinId of Object.keys(data)) {
            await saveCoinData(coinId, data[coinId]);
        }
        console.log('Cryptocurrency data saved successfully');
    } catch (error) {
        console.error('Error fetching and saving cryptocurrency data:', error.message);
    }
};

//  latest stats for a specified curency type
const getStats = async (req, res) => {
    const { coin } = req.query;

    if (!COIN_ID_TYPES.includes(coin)) {
        return res.status(400).json({ error: 'Invalid coin type specified' });
    }

    try {
        const latestRecord = await Coin.findOne({ coinId: coin }).sort({ createdAt: -1 });
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
    const { coin } = req.query;

    if (!COIN_ID_TYPES.includes(coin)) {
        return res.status(400).json({ error: 'Invalid coin type specified' });
    }

    try {
        const records = await Coin.find({ coinId: coin }).sort({ createdAt: -1 }).limit(100);
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
