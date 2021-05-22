const {
 whatsappClient
} = require('../client/client')
const {
 reCheck
} = require('../utils/recheck')

const sendWhatsAppMessage = (name, _data, state, config) => {

 reCheck(_data.difference, config)

 if (state) {
  whatsappClient.getChats().then((data) => {
   data.forEach(chat => {
    if (chat.isGroup && chat.name === config.messages.chatName) {
     whatsappClient.sendMessage(chat.id._serialized, `📈 ${name}: +${_data.difference} U$D. ${config.dates.oldCheck} ($${_data.old}) a ${config.dates.lastCheck} ($${_data.actual})`).then((response) => {
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
     whatsappClient.sendMessage(chat.id._serialized, `📉 ${name}: ${_data.difference} U$D. ${config.dates.oldCheck} ($${_data.old}) a ${config.dates.lastCheck} ($${_data.actual})`).then((response) => {
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
