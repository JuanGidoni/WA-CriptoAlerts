const {
 whatsappClient
} = require('../client/client')
const {
 reCheck
} = require('../utils/recheck')

const {
 calculate
} = require('../utils/percentage')

const sendWhatsAppMessage = (name, _data, state, config) => {

 reCheck(_data.difference, config)
 let porcentage
 if(!state && _data.oldPrice > _data.actualPrice){
  porcentage = calculate(_data.oldPrice, _data.actualPrice)
  whatsappClient.getChats().then((data) => {
   data.forEach(chat => {
    if (chat.isGroup && chat.name === config.messages.chatName) {
     whatsappClient.sendMessage(chat.id._serialized, `📉 ${name}: Bajo un ${porcentage}%. Precio actual: ${parseInt(_data.actualPrice)}`).then((response) => {
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
 }else{
  porcentage = calculate(_data.actualPrice, _data.oldPrice)
  whatsappClient.getChats().then((data) => {
   data.forEach(chat => {
    if (chat.isGroup && chat.name === config.messages.chatName) {
     whatsappClient.sendMessage(chat.id._serialized, `📈 ${name}: Subio un ${porcentage}%. Precio actual: ${parseInt(_data.actualPrice)}`).then((response) => {
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
 console.log(porcentage)

}

module.exports = {
 sendWhatsAppMessage
}
