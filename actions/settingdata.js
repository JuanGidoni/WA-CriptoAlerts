const {
 fetchingData
} = require('../api')

const settingData = async (config) => {
 try {
     let arrayPrices = await fetchingData()
     let prices = arrayPrices.filter(price =>
         price.symbol === config.keys.btc ||
         price.symbol === config.keys.eth ||
         price.symbol === config.keys.doge ||
         price.symbol === config.keys.ada ||
         price.symbol === config.keys.shiba
     )
     config.prices.currents = prices
     return prices
 } catch (error) {
     console.log(error)
 }
}

module.exports = {
 settingData
}
