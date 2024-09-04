const Reply = require('../../../structures/handlers/replyHandler');


module.exports = {
    name: 'wolpc',
    aliases: [],
    description: "wakes my pc",
    category: 'owner',
    ownerOnly: true,
    ignoreSlash: true,
    run: async (client, message, args) => {
        //94:C6:91:9A:73:E0
        console.log("hi")
		Reply.send(message, "Waking pc...")
		fetch(client.config.serverwakeapilink)
    }
}