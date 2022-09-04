const Reply = require('../../Structures/Handlers/replyHandler')
const wol = require('wol');

module.exports = {
    name: 'wolpc',
    aliases: [],
    description: "wakes my pc",
    category: 'owner',
    run: async (message, client, Discord, args, cmd) => {
        if(message.member.user.id != config.owner) return Reply.send(message, "I don't think this is for you!")
        wol.wake('94:C6:91:9A:73:E0', function(err, res){
            console.log(err);
        });
        await Reply.send(message, "Waking pc...")
    }
}