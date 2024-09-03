import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import P from "pino";
import type { Server } from "socket.io";

const logger = P({ 
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
  level: 'trace', 
}, P.destination('./wa-logs.txt'))

const connectToWhatsApp = async (webBroadcast: Server) => {
  const { state, saveCreds } = await useMultiFileAuthState("session")

  const sock = makeWASocket({
    auth: state,
    // logger,
    printQRInTerminal: true,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect!.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('connection closed due to ', lastDisconnect!.error, ', reconnecting ', shouldReconnect)
      // reconnect if not logged out
      if(shouldReconnect) {
          connectToWhatsApp(webBroadcast)
      }
    } else if(connection === 'open') {
      console.log('opened connection')
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    console.log(JSON.stringify(m, undefined, 2))
    m.messages.map(item => {
      webBroadcast.emit('message in', {
        message: item.message?.conversation,
        sender: item.pushName,
      })
    })
  });

  sock.ev.on('creds.update', saveCreds);
}

export default connectToWhatsApp;