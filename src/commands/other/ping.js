
Reply = require('../../Utils/replyHandler')

module.exports = {
    name: 'ping',
    aliases: [],
    description: "pong!",
    category: 'other',
    run: (message, client, Discord, args, cmd) => {
        let pongMessage = ''
        message.channel.send('Loading data').then(async (msg) => {
            msg.delete()
            pongMessage += `pong! : Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`
            Reply.send(message, pongMessage, false)
        })
        
    }
}

async function pong(message){
    
    
    
}