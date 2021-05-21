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
    diference: element.price - v.price
   })
  )[0]
 )

 diffPrices.map(
  (v) => {
   let dif = Number(parseFloat(v.diference).toFixed(5))
   let checker = Math.sign(dif)

   if (v.symbol === process.env.BTC_KEY) {
    config.differences.btc = dif
    if (dif < 0 && dif <= -Math.abs(config.priceBalance.btc))
     sendWhatsAppMessage('BITCOIN', dif, v.actualPrice, v.oldPrice, false)
    else if (dif > config.priceBalance.btc)
     sendWhatsAppMessage('BITCOIN', dif, v.actualPrice, v.oldPrice, true)
   }
   if (v.symbol === process.env.ETH_KEY) {
    config.differences.eth = dif
    if (dif < 0 && dif <= -Math.abs(config.priceBalance.eth))
     sendWhatsAppMessage('ETHEREUM', dif, v.actualPrice, v.oldPrice, false)
    else if (config.priceBalance.eth < dif)
     sendWhatsAppMessage('ETHEREUM', dif, v.actualPrice, v.oldPrice, true)
   }
   if (v.symbol === process.env.DOGE_KEY) {
    config.differences.doge = dif
    if (dif < 0 && dif <= -Math.abs(config.priceBalance.doge))
     sendWhatsAppMessage('DOGECOIN', dif, v.actualPrice, v.oldPrice, false)
    else if (config.priceBalance.doge < dif)
     sendWhatsAppMessage('DOGECOIN', dif, v.actualPrice, v.oldPrice, true)
   }
   if (v.symbol === process.env.ADA_KEY) {
    config.differences.ada = dif
    if (dif < 0 && dif <= -Math.abs(config.priceBalance.ada))
     sendWhatsAppMessage('ADA', dif, v.actualPrice, v.oldPrice, false)
    else if (config.priceBalance.ada < dif)
     sendWhatsAppMessage('ADA', dif, v.actualPrice, v.oldPrice, true)
   }
   if (v.symbol === process.env.SHIB_KEY) {
    config.differences.shiba = dif
    if (dif < 0 && dif <= -Math.abs(config.priceBalance.shiba))
     sendWhatsAppMessage('SHIBA', dif, v.actualPrice, v.oldPrice, false)
    else if (config.priceBalance.shiba < dif)
     sendWhatsAppMessage('SHIBA', dif, v.actualPrice, v.oldPrice, true)
   }

  }
 )

}

module.exports = {
 checkPriceThenSendMsg
}
