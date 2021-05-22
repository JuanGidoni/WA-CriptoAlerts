const {
 formatedDate
} = require('../utils/date')

const env = require('dotenv');
env.config()

let config = {
 timer: 3000,
 keys: {
  btc: process.env.BTC_KEY,
  eth: process.env.ETH_KEY,
  doge: process.env.DOGE_KEY,
  ada: process.env.ADA_KEY,
  shiba: process.env.SHIB_KEY,
 },
 priceBalance: {
  btc: Number(process.env.BTCDIF),
  eth: Number(process.env.ETHDIF),
  doge: Number(process.env.DOGEDIF),
  ada: Number(process.env.ADADIF),
  shiba: Number(process.env.SHIBDIF)
 },
 prices: {
  olds: [],
  currents: []
 },
 messages: {
  chatName: 'Cryptos y Clandes'
 },
 dates: {
  initBot: formatedDate(),
  oldCheck: formatedDate(),
  lastCheck: ''
 },
 reCheck: false,
 differences: {}
}

module.exports = {
 config
}
