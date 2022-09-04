const fs = require('fs');
const file = require('../../Utils/File')
module.exports = {
    name: 'prefix',
    aliases: [],
    description: "wip",
    category: 'other',
    noHelp: true,
    run: async (message, client, Discord, args, cmd) => {
        if (!fs.existsSync(`./src/guildData/${message.guild.id}`)) {
            fs.mkdirSync(`./src/guildData/${message.guild.id}`);
        }
        if (!await file.exists(`./src/guildData/${message.guild.id}/prefix.xd`)) {
            await file.save(`./src/guildData/${message.guild.id}/prefix.xd`, process.env.PREFIX, true)
        }
        if (!args[0]) return Reply.send(message, 'please provide a new prefix')
        await file.save(`./src/guildData/${message.guild.id}/prefix.xd`, args[0], true);
        prefix = await file.read(`./src/guildData/${message.guild.id}/prefix.xd`);
        Reply.send(message, `prefix has been set to: ${prefix}`)
    }
}