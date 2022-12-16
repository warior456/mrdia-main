const Reply = require('../../../structures/handlers/replyHandler');
const wol = require('wol')

module.exports = {
    name: 'wolpc',
    aliases: [],
    description: "wakes my pc",
    category: 'owner',
    ownerOnly: true,
    ignoreSlash: true,
    run: async (client, message, args) => {
        wol.wake('94:C6:91:9A:73:E0', function(err, res){
            console.log(err);
        });
        await Reply.send(message, "Waking pc...")
    }
}