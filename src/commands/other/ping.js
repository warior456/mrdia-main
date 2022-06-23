module.exports = {
    name: 'ping',
    aliases: [],
    description: "pong!",
    run: (message, args, cmd, client, Discord) => {
        message.channel.send('Loading data').then(async (msg) => {
            msg.delete()
            message.channel.send(`pong! : Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
        })
    }
}

