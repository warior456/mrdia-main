const discord = require('discord.js');
const config = require("../../../Config");

module.exports = {
    name: 'help',
    aliases: ['?'],
    description: 'shows all commands',
    run: (message, args, cmd, client, Discord) => {
        if (cmd === 'help' || cmd === '?') {
            switch (args[0]) {
                // case 'music':
                //     help_music(message);
                //     break;

                // case 'hidden':
                //     help_hidden(message, client)
                //     break;

                default:
                    help(message, client);
                    break;
            }
        }

    }
}

// async function help_default(message) {
//     const mainEmbed = new discord.MessageEmbed()
//         .setColor('#a5fc03')
//         .setTitle('**Help**')
//         .setDescription(`My prefix is ${(process.env.PREFIX)}`)
//         .addFields(                                                             //{name: '', value: ''}
//             { name: `${(process.env.PREFIX)}help`, value: 'Shows this message' },
//             { name: `${(process.env.PREFIX)}invite`, value: 'Gives the invite link of this bot' },
//             { name: `${(process.env.PREFIX)}ping`, value: 'pong!' },
//             { name: `${(process.env.PREFIX)}clear [amount 1-100]`, value: 'Clears up to 100 messages' },
//             { name: `${(process.env.PREFIX)}party [Youtube / poker / fishington / betrayal / chess]`, value: 'Play games or watch youtube together' },
//             { name: `${(process.env.PREFIX)}help music`, value: 'Shows the commands related to music' },
//         )
//     message.channel.send({ embeds: [mainEmbed] });
// }

// async function help_music(message) {
//     const musicEmbed = new discord.MessageEmbed()
//         .setColor('#a5fc03')
//         .setTitle('**Music help**')
//         .setDescription(`My prefix is ${(process.env.PREFIX)}`)
//         .addFields(
//             { name: `${(process.env.PREFIX)}p / play`, value: 'Adds a song to the queue' },
//             { name: `${(process.env.PREFIX)}pl / playlist`, value: 'Adds a playlist to the queue' },
//             { name: `${(process.env.PREFIX)}pause`, value: 'Pauses the music' },
//             { name: `${(process.env.PREFIX)}resume`, value: 'Resumes the music' },
//             { name: `${(process.env.PREFIX)}np / nowplaying`, value: 'Shows the current playing song' },
//             { name: `${(process.env.PREFIX)}q / queue ([optional]pageNumber)`, value: 'Shows the songs in queue' },
//             { name: `${(process.env.PREFIX)}s / skip`, value: 'Skips a song and goes to the next one' },
//             { name: `${(process.env.PREFIX)}fs / fskip`, value: 'Force skips a song and goes to the next one' },
//             { name: `${(process.env.PREFIX)}stop / leave`, value: 'Stops the music and leaves' },
//             { name: `${(process.env.PREFIX)}lq / loopqueue`, value: 'Loops the queue' },
//             { name: `${(process.env.PREFIX)}l / loop`, value: 'Loops the current song' },
//             { name: `${(process.env.PREFIX)}remove (songnumber)`, value: 'Removes the provided song number' },
//             { name: `${(process.env.PREFIX)}shuffle`, value: 'Shuffles the queue' },
//             { name: `${(process.env.PREFIX)}seek (seconds)`, value: 'Sets the song time to the amount of seconds given' },
//             { name: `${(process.env.PREFIX)}sq / savequeue (name)`, value: 'Saves the current queue with the name given' },
//             { name: `${(process.env.PREFIX)}loq / loadqueue (name)`, value: 'Loads the queue given at the end of the current queue' },
//             { name: `There are more commands that aren't in this help menu cuz i'm lazy`, value: 'You can figure them out or ask Matteo_fey' },
//         )

//     message.channel.send({ embeds: [musicEmbed] });
// }

async function help(message, client) {
    const hiddenEmbed = new discord.MessageEmbed()
        .setColor('#a5fc03')
        .setTitle(`**Hidden commands tips \nMy prefix is ${(config.prefix)}**`)
        .setDescription(all_cmds(client))
        // .addFields(                                                             //{name: '', value: ''}
        //     { name: all_cmds(client), value: "the commands" },
        // )
    message.channel.send({ embeds: [hiddenEmbed] });
}

function all_cmds(client) {
    let message = ''
    client.commands.messageCommands.forEach(cmd => {
        message += `**${config.prefix}${cmd.name}**\n ${cmd.description} | [${cmd.aliases}]\n\n`
    
    });
    return message
}