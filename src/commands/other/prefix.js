// const fs = require('fs');
// const file = require('../../Utils/File')
// module.exports = {
//     name: 'prefix',
//     description: "pong!",
//     run: async (message, args, cmd, client, Discord) => {
//         if (!fs.existsSync(`./guildData/${message.guild.id}`)) {
//             fs.mkdirSync(`./guildData/${message.guild.id}`);
//         }
//         if (!await file.exists(`./guildData/${message.guild.id}/prefix.xd`)) {
//             await file.save(`./guildData/${message.guild.id}/prefix.xd`, process.env.PREFIX, true)
//         }
//         if (!args[0]) return message.channel.send('please provide a new prefix')
//         await file.save(`./guildData/${message.guild.id}/prefix.xd`, args[0], true);
//         prefix = await file.read(`./guildData/${message.guild.id}/prefix.xd`);
//         message.channel.send(`prefix has been set to: ${prefix}`)
//     }
// }