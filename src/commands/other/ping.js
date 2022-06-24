module.exports = {
    name: 'ping',
    aliases: [],
    description: "pong!",
    run: (message, client, Discord, args, cmd) => {
        message.channel.send('Loading data').then(async (msg) => {
            msg.delete()
            message.channel.send(`pong! : Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
        })
    }
}

