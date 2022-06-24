const fs = require('fs');
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'listqueues',
    aliases: ['listqs', 'listq'],
    description: 'Shows all saved queues',
    run: (message, client, Discord, args, cmd, player) => {
        if (cmd === 'listqueues' || cmd === 'listqs' || cmd === 'listq') listqs(message, client, Discord, args, cmd, player);
    }
}
function listqs(message, client, Discord, args, cmd, player, guildQueue) {
    try {
        if (!fs.existsSync(`./src/guildData/${message.guild.id}`)) {
            fs.mkdirSync(`./src/guildData/${message.guild.id}`);
        }
        let req_page = args[0]
        let ques = fs.readdirSync(`./src/guildData/${message.guild.id}/`).filter(files => files.endsWith('.csv'))
        let pages = Math.ceil(ques.length / 10)
        if (!req_page || req_page <= 0) req_page = 1

        let queueMessage = ''

        if (req_page > pages) return message.channel.send(`There are only ${pages} pages`)
        for (var i = req_page * 10 - 9; i <= ques.length && i <= req_page * 10; i++) {
            queueMessage += `${ques[i - 1]} \n`
        }
        let footer = `page ${req_page}/${pages} `
        const queEmbed = new MessageEmbed()
            .setTitle('Queues saved in this server')
            .setColor('#a20000')
            .addFields(
                { name: queueMessage, value: footer },
            );

        message.channel.send({ embeds: [queEmbed] })
    } catch (error) {
        console.log(error)
    }
}
