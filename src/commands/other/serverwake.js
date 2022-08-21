const Reply = require('../../Structures/Handlers/replyHandler')
const wol = require('wol');

module.exports = {
    name: 'wake',
    aliases: [],
    description: "wakes the Minecraft server",
    category: 'other',
    run: async (message, client, Discord, args, cmd) => {
        if(message.channel.id != '998168141911822376') return Reply.send(message, 'Wrong channel! (go to: Not a Discord Community But Rather a Discord Server #serverwake)')
        wol.wake('E8:40:F2:3D:FB:93', function(err, res){
            console.log(err);
        });
        await Reply.send(message, "Waking server...")
    }
}
