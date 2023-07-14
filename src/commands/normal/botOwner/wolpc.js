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
        let i = document.createElement("img")
		i.src = client.config.pcwakeapilink
        Reply.send(message, "Waking pc...")
    }
}