const { sendWhatsAppMessage } = require('./sendWhatsAppMessage')
const checkPriceThenSendMsg = (current, config) => {
 config.reCheck = false
 let diffPrices = current.map(
  (element) => config.prices.olds.filter(
   e => e.symbol === element.symbol
  ).map(
   (v) => ({
    symbol: v.symbol,
    actualPrice: element.price,
    oldPrice: v.price,
    difference: Number(parseFloat(element.price - v.price))
   })
  )[0]
 )

 diffPrices.map(
  (v) => {
    let dif = v.difference
   if (v.symbol === process.env.BTC_KEY) {
    config.differences.btc = dif
    if (dif < 0 && dif <= -Math.abs(config.priceBalance.btc))
     sendWhatsAppMessage('BITCOIN', v, false, config)
    else if (dif > config.priceBalance.btc)
     sendWhatsAppMessage('BITCOIN', v, true, config)
   }
   if (v.symbol === process.env.ETH_KEY) {
    config.differences.eth = dif
    if (dif < 0 && dif <= -Math.abs(config.priceBalance.eth))
     sendWhatsAppMessage('ETHEREUM', v, false, config)
    else if (config.priceBalance.eth < dif)
     sendWhatsAppMessage('ETHEREUM', v, true, config)
   }
   if (v.symbol === process.env.DOGE_KEY) {
    config.differences.doge = dif
    if (dif < 0 && dif <= -Math.abs(config.priceBalance.doge))
     sendWhatsAppMessage('DOGECOIN', v, false, config)
    else if (config.priceBalance.doge < dif)
     sendWhatsAppMessage('DOGECOIN', v, true, config)
   }
   if (v.symbol === process.env.ADA_KEY) {
    config.differences.ada = dif
    if (dif < 0 && dif <= -Math.abs(config.priceBalance.ada))
     sendWhatsAppMessage('ADA', dif, v, false, config)
    else if (config.priceBalance.ada < dif)
     sendWhatsAppMessage('ADA', dif, v, true, config)
   }
   if (v.symbol === process.env.SHIB_KEY) {
    config.differences.shiba = dif
    if (dif < 0 && dif <= -Math.abs(config.priceBalance.shiba))
     sendWhatsAppMessage('SHIBA', dif, v, false, config)
    else if (config.priceBalance.shiba < dif)
     sendWhatsAppMessage('SHIBA', dif, v, true, config)
   }

  }
 )

}

module.exports = {
 checkPriceThenSendMsg
}
