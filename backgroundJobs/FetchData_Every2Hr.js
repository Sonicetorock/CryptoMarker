const { fetchAndStoreCryptoData } = require('../controllers/updateController');

const startBackgroundJob = () => {
    console.log('Intiating the cryptocurrency data fetch job...');

    fetchAndStoreCryptoData();

    // Run the job every 2 hours
    setInterval(async () => {
        console.log('Ok 2hrs Done !! , Running the cryptocurrency data fetch job...');
        await fetchAndStoreCryptoData();
    }, 7200000);
};

module.exports = { startBackgroundJob };
// 2mins => 120 sec=> 120000ms
// 2hrs => 120mins => 120*60 => 7200secsa => 7200000ms
