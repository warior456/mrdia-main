const { MessageEmbed } = require('discord.js');
const config = require("../../../Config");
const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'help',
    aliases: ['?'],
    description: 'help commands',
    options: [{
        name: "type",
        type: "STRING",
        description: "other, music",
        choices: [{ name: 'other', value: 'other' },{ name: 'music', value: 'music' }],
        required: true
    }],
    category: 'other',
    run: (message, client, Discord, args, cmd) => {
        if (!args[0]) args[0] = 'other'
        help(message, client, args[0])
    }
}

function help(message, client, option) {
    const helpEmbed = new MessageEmbed()
        .setColor('#a5fc03')
        .setTitle(`**My prefix is: ${(config.prefix)}**`)
        .setDescription(helpMsg(client, option))
        
    Reply.send(message, { embeds: [helpEmbed] })
}

function helpMsg(client, option) {
    let help_msg = ''
    client.commands.messageCommands.forEach(cmd => {
        if (cmd.category != option) return
        if (cmd.noHelp) return
        help_msg += `**${config.prefix}${cmd.name}** | [${cmd.aliases}]\n ${cmd.description}\n\n`
    });
    return help_msg
}
