const {
 Client
} = require('whatsapp-web.js');

const qrcode = require('qrcode-terminal');

const fs = require('fs');

let sessionData;

const SESSION_FILE_PATH = '../session.json';

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

module.exports = {
 whatsappClient
}
