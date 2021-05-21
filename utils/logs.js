const logs = (config) => {
 console.log(['////////////////////////'])
 console.log(['Dates'])
 console.log(config.dates)
 console.log(`From: ${config.dates.oldCheck ? config.dates.oldCheck : 'none'} to ${config.dates.lastCheck ? config.dates.lastCheck : 'none'}`)
 console.log(['Configuration'])
 console.log(config.priceBalance)
 console.log(config.reCheck)
 console.log(['Prices'])
 console.log(config.prices.olds)
 console.log(config.prices.currents)
 console.log(['Differences'])
 console.log(config.differences)
 console.log(['Chat Name'])
 console.log(config.messages.chatName)
 console.log(['////////////////////////'])
}

module.exports = {
 logs
}
