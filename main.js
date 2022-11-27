const { Client } = require('discord.js');
const { Player } = require("@jadestudios/discord-music-player");
const { connect } = require("mongoose")
require('dotenv').config();

(async () => {
    const Discord = require("discord.js");
    const config = require("./Config");
    const path = __dirname;
    global.client = new Client({
        intents: [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            // Discord.Intents.FLAGS.GUILD_PRESENCES,
            Discord.Intents.FLAGS.DIRECT_MESSAGES,
            Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            // Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.GUILD_WEBHOOKS,
            Discord.Intents.FLAGS.GUILD_VOICE_STATES,
            Discord.Intents.FLAGS.GUILD_INVITES,
            Discord.Intents.FLAGS.GUILD_BANS
        ],
        partials: ["CHANNEL"]
    });
    exports.client = client;
    exports.path = path;
    exports.config = config;
    client.commands = {};
    client.events = new Discord.Collection();
    client.commands.messageCommands = new Discord.Collection();
    client.commands.messageCommands.aliases = new Discord.Collection();
    client.commands.contextMenus = new Discord.Collection();
    client.commands.slashCommands = new Discord.Collection();
    client.commands.buttonCommands = new Discord.Collection();
    client.commands.selectMenus = new Discord.Collection();

    const Handler = require(`${path}/src/Structures/Handlers/Handler`);

    await Handler.loadMessageCommands(client, path);
    await Handler.loadEvents(client);

    await client.login(config.token);

    try {
        await connect(config.dbtoken).catch("Database error")
    } catch (error) {
        console.log (error)
    }

    await Handler.loadSlashCommands(client, path);
    await Handler.loadContextMenus(client, path);
    await Handler.loadButtonCommands(client, path);
    await Handler.loadSelectMenus(client, path);

    // require('./src/Structures/Handlers/Handler')

})()

const player = new Player(client, {
    leaveOnEmpty: false,            //optional
});
client.player = player;
const Genius = require("genius-lyrics");
const err = require('./src/events/mongo/err');
global.LyricsClient = new Genius.Client();
// const Discord = require('discord.js');
// import('node-fetch')

// const { Client, Intents } = require('discord.js');
// global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INVITES] });

// require('dotenv').config();

// require('ffmpeg-static');
// const { Player } = require("discord-music-player");
// require('./src/Structures/Handlers/Handler')
// const player = new Player(client, {
//     leaveOnEmpty: false,            //optional
// });
// client.player = player;

// client.player
//     .on('channelEmpty', (queue) => console.log(`Everyone left the Voice Channel, queue ended.`))
//     .on('songAdd', (queue, song) => console.log(`Song ${song} was added to the queue.`))
//     .on('playlistAdd', (queue, playlist) => console.log(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`))
//     .on('queueEnd', (queue) => console.log(`The queue has ended.`))
//     .on('songChanged', (queue, newSong, oldSong) => console.log(`${newSong} is now playing.`))
//     .on('songFirst', (queue, song) => console.log(`Started playing ${song}.`))
//     .on('clientDisconnect', (queue) => console.log(`I was kicked from the Voice Channel, queue ended.`))
//     .on('clientUndeafen', (queue) => console.log(`I got undefeanded.`))
//     .on('error', (error, queue) => {
//         try {
//             console.log(`Error: ${error} in ${queue.guild.name}`);
//         } catch (error) {
//             console.log('something went very wrong');
//             console.log(error);
//         }
//     });


// // client.events = new Discord.Collection();
// // client.buttons = new Discord.Collection();

// // ['loader', 'event_handler'].forEach(handler =>{
// //     require(`./handlers/${handler}`)(client, Discord)
// // })


// client.login(process.env.DISCORD_TOKEN);