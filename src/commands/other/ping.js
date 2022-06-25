Reply = require('../../Utils/replyHandler')

module.exports = {
    name: 'ping',
    aliases: [],
    description: "pong!",
    run: (message, client, Discord, args, cmd) => {
        let pongMessage = `pong!`
        Reply.send(message, pongMessage, false)
        // try {
        //     message.reply({ content: pong(message), fetchReply: true })
                
        // } catch (error) {
        //     message.channel.send(pong(message));
        // }
    }
}

function pong(message){
    message.channel.send('Loading data').then(async (msg) => {
        msg.delete()
        let pongMessage = `pong! : Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`
        return pongMessage
    })
    
}