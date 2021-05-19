const fetch = require('node-fetch');
const env = require('dotenv')
env.config()
const fetchingData = async () => {
    const url = `https://${process.env.BINANCE}`
    try {
        const call = fetch(url)
        const res = await call
        return res.json()

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    fetchingData
}
