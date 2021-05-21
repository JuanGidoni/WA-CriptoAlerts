const {
    settingData,
    whatsappClient,
    checkPriceThenSendMsg,
    config,
    setInterval,
    formatedDate,
    logs
} = require('./init')

whatsappClient.on('ready', () => {
    console.log('WhatsApp: Client is Ready!');
    setInterval(() => {
        logs(config)
        settingData(config).then(
            (data) => {
                config.dates.lastCheck = formatedDate()
                config.prices.olds = config.prices.olds.length === 0 ? data : config.prices.olds
                checkPriceThenSendMsg(data, config)
            }
        ).catch(err => console.log(err))
    }, config.timer);
});

whatsappClient.initialize();
