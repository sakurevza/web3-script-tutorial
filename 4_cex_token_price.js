const axios = require('axios')  // First run: npm install axios

async function getPriceOkx(tick1, tick2) {
    const url = `https://www.okx.com/api/v5/market/ticker?instId=${tick1}-${tick2}-SWAP`;
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.error('Error fetching price:', error.message)
        return ""
    }
}

async function getPriceBinance(tick1, tick2) {
    const url = `https://api.binance.com/api/v3/ticker/price?symbol=${tick1}${tick2}`;
    try {
        const response = await axios.get(url)
        return response.data
    } catch (error) {
        console.error('Error fetching price:', error.message)
        return ""
    }
}

async function main() {
    try {
        const response = await getPriceOkx("ETH", "USDT")
        const price = response.data[0].last
        console.log(price)

        const response2 = await getPriceBinance("ETH", "USDT")
        const price2 = response2.price
        console.log(price2)
    } catch (error) {
        console.error('Error:', error)
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});