const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/code', async (req,res)=>{
  try{
    const num = req.body.number.replace(/[^0-9]/g,'');
    const { state, saveCreds } = await useMultiFileAuthState('./temp-'+num);
    const sock = makeWASocket({ auth: state, printQRInTerminal:false, browser:["BADY 7 MD","Chrome","1.0"] });
    sock.ev.on('creds.update', saveCreds);
    await new Promise(r=> setTimeout(r,2500));
    const code = await sock.requestPairingCode(num);
    res.json({code: code});
  }catch(e){ res.json({error: e.message}); }
});

app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'public/index.html')));
app.listen(3000, ()=> console.log("BADY 7 MD PAIR SITE LIVE"));
