const {
 whatsappClient
} = require('../client/client')
const {
 reCheck
} = require('../utils/recheck')

const sendWhatsAppMessage = (name, difference, actual, old, state, config) => {

 reCheck(difference, config)

 if (state) {
  whatsappClient.getChats().then((data) => {
   data.forEach(chat => {
    if (chat.isGroup && chat.name === config.messages.chatName) {
     whatsappClient.sendMessage(chat.id._serialized, `📈 ${name}: +${difference} U$D. ${config.dates.oldCheck} ($${old}) a ${config.dates.lastCheck} ($${actual})`).then((response) => {
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
     whatsappClient.sendMessage(chat.id._serialized, `📉 ${name}: ${difference} U$D. ${config.dates.oldCheck} ($${old}) a ${config.dates.lastCheck} ($${actual})`).then((response) => {
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

module.exports = {
 sendWhatsAppMessage
}
