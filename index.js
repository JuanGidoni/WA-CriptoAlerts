const {
    Client
} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const {
    setInterval
} = require('timers');
const {
    fetchingData
} = require('./api')
const {
    formatedDate
} = require('./utils/date')

const env = require('dotenv');
env.config()

let sessionData;

const SESSION_FILE_PATH = './session.json';

if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

const whatsappClient = new Client({
    session: sessionData
});

whatsappClient.on('qr', (qr) => {
    console.log('QR RECEIVED');
    qrcode.generate(qr)
});

whatsappClient.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

let config = {}
config.priceBalance = {
    btc: Number(process.env.BTCDIF),
    eth: Number(process.env.ETHDIF),
    doge: Number(process.env.DOGEDIF),
    ada: Number(process.env.ADADIF),
    shiba: Number(process.env.SHIBDIF)
}
config.prices = {
    olds: [],
    currents: []
}
config.messages = {}
config.reCheck = false
config.differences = {}
config.messages.chatName = 'Cryptos y Clandes'
config.dates = {
    initBot: formatedDate(),
    oldCheck: '',
    lastCheck: ''
}

const settingData = async () => {
    try {
        let arrayPrices = await fetchingData()
        let prices = arrayPrices.filter(price =>
            price.symbol === process.env.BTC_KEY ||
            price.symbol === process.env.ETH_KEY ||
            price.symbol === process.env.DOGE_KEY ||
            price.symbol === process.env.ADA_KEY ||
            price.symbol === process.env.SHIB_KEY
        )
        config.prices.currents = prices
        return prices
    } catch (error) {
        console.log(error)
    }
}
const reCheck = (difference) => {
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

        if (config.reCheck) settingData().then(
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
const sendWhatsAppMessage = (name, difference, actual, state) => {

    reCheck(difference)

    if (state) {
        whatsappClient.getChats().then((data) => {
            data.forEach(chat => {
                if (chat.isGroup && chat.name === config.messages.chatName) {
                    whatsappClient.sendMessage(chat.id._serialized, `📈 ${name}: +${difference}. Desde: ${config.dates.oldCheck} a ${config.dates.lastCheck}`).then((response) => {
                        if (response.id.fromMe) {
                            console.log({
                                status: 'success',
                                message: `Message successfully send to ${config.messages.chatName}`
                            })
                        }
                    });
                }
            });
        });
    } else {
        whatsappClient.getChats().then((data) => {
            data.forEach(chat => {
                if (chat.isGroup && chat.name === config.messages.chatName) {
                    whatsappClient.sendMessage(chat.id._serialized, `📉 ${name}: -${difference}. Desde: ${config.dates.oldCheck} a ${config.dates.lastCheck}`).then((response) => {
                        if (response.id.fromMe) {
                            console.log({
                                status: 'success',
                                message: `Message successfully send to ${config.messages.chatName}`
                            })
                        }
                    });
                }
            });
        });
    }

}

const checkPriceThenSendMsg = (current) => {
    config.reCheck = false
    let diffPrices = current.map(
        (element) => config.prices.olds.filter(
            e => e.symbol === element.symbol
        ).map(
            (v) => ({
                symbol: v.symbol,
                actualPrice: v.price,
                diference: element.price - v.price
            })
        )[0]
    )

    diffPrices.map(
        (v) => {
            let dif = Number(parseFloat(v.diference).toFixed(5))
            let checker = Math.sign(dif)
            switch (v.symbol) {
                case process.env.BTC_KEY:
                    config.differences.btc = dif
                    if (dif < 0 && dif <= -Math.abs(config.priceBalance.btc))
                        sendWhatsAppMessage('BITCOIN', dif, v.actualPrice, false)
                    else if (dif > config.priceBalance.btc)
                        sendWhatsAppMessage('BITCOIN', dif, v.actualPrice, true)
                    break;
                case process.env.ETH_KEY:
                    config.differences.eth = dif
                    if (dif < 0 && dif <= -Math.abs(config.priceBalance.eth))
                        sendWhatsAppMessage('ETHEREUM', dif, v.actualPrice, false)
                    else if (config.priceBalance.eth < dif)
                        sendWhatsAppMessage('ETHEREUM', dif, v.actualPrice, true)
                    break;
                case process.env.DOGE_KEY:
                    config.differences.doge = dif
                    if (dif < 0 && dif <= -Math.abs(config.priceBalance.doge))
                        sendWhatsAppMessage('DOGECOIN', dif, v.actualPrice, false)
                    else if (config.priceBalance.doge < dif)
                        sendWhatsAppMessage('DOGECOIN', dif, v.actualPrice, true)
                    break;
                case process.env.ADA_KEY:
                    config.differences.ada = dif
                    if (dif < 0 && dif <= -Math.abs(config.priceBalance.ada))
                        sendWhatsAppMessage('ADA', dif, v.actualPrice, false)
                    else if (config.priceBalance.ada < dif)
                        sendWhatsAppMessage('ADA', dif, v.actualPrice, true)
                    break;
                case process.env.SHIB_KEY:
                    config.differences.shiba = dif
                    if (dif < 0 && dif <= -Math.abs(config.priceBalance.shiba))
                        sendWhatsAppMessage('SHIBA', dif, v.actualPrice, false)
                    else if (config.priceBalance.shiba < dif)
                        sendWhatsAppMessage('SHIBA', dif, v.actualPrice, true)
                    break;
            }
        }
    )

}

whatsappClient.on('ready', () => {
    console.log('WhatsApp: Client is Ready!');
    setInterval(() => {
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

        settingData().then(
            (data) => {
                config.dates.lastCheck = formatedDate()
                config.prices.olds = config.prices.olds.length === 0 ? data : config.prices.olds
                checkPriceThenSendMsg(data)
            }
        ).catch(err => console.log(err))
    }, 30000);
});

whatsappClient.initialize();