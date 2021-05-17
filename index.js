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

const env = require('dotenv')
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
config.prices = []
config.messages = {}
config.messages.chatName = 'Cryptos y Clandes'

const settingData = async () => {
    try {
        let arrayPrices = await fetchingData()
        let prices = arrayPrices.filter(price => 
            price.symbol === process.env.BTC_KEY 
            || 
            price.symbol === process.env.ETH_KEY 
            || 
            price.symbol === process.env.DOGE_KEY
            ||
            price.symbol === process.env.ADA_KEY
            ||
            price.symbol === process.env.SHIB_KEY
        )
        return prices
    } catch (error) {
        console.log(error)
    }
}

const sendWhatsAppMessage = (name, difference, actual, state) => {
    if (state) {
        whatsappClient.getChats().then((data) => {
            data.forEach(chat => {
                if (chat.isGroup && chat.name === config.messages.chatName) {
                    whatsappClient.sendMessage(chat.id._serialized, `📈 ${name}: +${difference}, Precio Actual: $${actual}`).then((response) => {
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
                    whatsappClient.sendMessage(chat.id._serialized, `📉 ${name}: -${difference}, Precio Actual: $${actual}`).then((response) => {
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

    let diffPrices = current.map(
        (element) => config.prices.filter(
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
            switch (v.symbol) {
                case process.env.BTC_KEY:
                    if (dif > config.priceBalance.btc)
                        sendWhatsAppMessage('BITCOIN', v.diference, v.actualPrice, true)
                    if (config.priceBalance.btc < dif)
                        sendWhatsAppMessage('BITCOIN', v.diference, v.actualPrice, false)
                    break;
                case process.env.ETH_KEY:
                    if (dif > config.priceBalance.eth)
                        sendWhatsAppMessage('ETHEREUM', v.diference, v.actualPrice, true)
                    if (config.priceBalance.eth < dif)
                        sendWhatsAppMessage('ETHEREUM', v.diference, v.actualPrice, false)
                    break;
                case process.env.DOGE_KEY:
                    if (dif > config.priceBalance.doge)
                        sendWhatsAppMessage('DOGECOIN', v.diference, v.actualPrice, true)
                    if (config.priceBalance.doge < dif)
                        sendWhatsAppMessage('DOGECOIN', v.diference, v.actualPrice, false)
                    break;
                case process.env.ADA_KEY:
                    if (dif > config.priceBalance.ada)
                        sendWhatsAppMessage('ADA', v.diference, v.actualPrice, true)
                    if (config.priceBalance.ada < dif)
                        sendWhatsAppMessage('ADA', v.diference, v.actualPrice, false)
                    break;
                case process.env.SHIB_KEY:
                    if (dif > config.priceBalance.shiba)
                        sendWhatsAppMessage('SHIBA', v.diference, v.actualPrice, true)
                    if (config.priceBalance.shiba < dif)
                        sendWhatsAppMessage('SHIBA', v.diference, v.actualPrice, false)
                    break;
                default:
                    break;
            }
        }
    )

}

whatsappClient.on('ready', () => {
    console.log('WhatsApp: Client is Ready!');
    setInterval(() => {
        console.log(config)
        settingData().then(
            (data) => {
                config.prices = config.prices.length === 0 ? data : config.prices
                checkPriceThenSendMsg(data)
            }
        ).catch(err => console.log(err))
    }, 30000);
});

whatsappClient.initialize();