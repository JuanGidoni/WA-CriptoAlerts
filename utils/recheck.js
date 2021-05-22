const {
 settingData
} = require('../actions/settingdata')
const {
 formatedDate
} = require('./date')

const reCheck = (difference, config) => {
 try {
  if (difference < 0 && difference <= -Math.abs(config.priceBalance.btc)) config.reCheck = true
  if (difference < 0 && difference <= -Math.abs(config.priceBalance.eth)) config.reCheck = true
  if (difference < 0 && difference <= -Math.abs(config.priceBalance.doge)) config.reCheck = true
  if (difference < 0 && difference <= -Math.abs(config.priceBalance.ada)) config.reCheck = true
  if (difference < 0 && difference <= -Math.abs(config.priceBalance.shiba)) config.reCheck = true

  if (difference >= config.priceBalance.btc) config.reCheck = true
  if (difference >= config.priceBalance.eth) config.reCheck = true
  if (difference >= config.priceBalance.doge) config.reCheck = true
  if (difference >= config.priceBalance.ada) config.reCheck = true
  if (difference >= config.priceBalance.shiba) config.reCheck = true

  if (config.reCheck) settingData(config).then(
   (data) => {
    config.dates.oldCheck = formatedDate()
    config.prices.olds = data
   }
  ).catch(err => console.log(err))
  else config.reCheck = false
  
 } catch (error) {
  console.log(error)
 }
}

module.exports = {
 reCheck
}

