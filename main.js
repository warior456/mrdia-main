const Discord = require('discord.js');
import('node-fetch')    

const { Client, Intents } = require('discord.js');
global.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_INVITES] });

require('dotenv').config();

require('ffmpeg-static');
const { Player } = require("discord-music-player");
require('./handlers/loader')
const player = new Player(client, {
    leaveOnEmpty: false,            //optional
});
client.player = player;

client.player
    .on('channelEmpty',  (queue) => console.log(`Everyone left the Voice Channel, queue ended.`))
    .on('songAdd',  (queue, song) => console.log(`Song ${song} was added to the queue.`))
    .on('playlistAdd',  (queue, playlist) => console.log(`Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`))
    .on('queueEnd',  (queue) => console.log(`The queue has ended.`))
    .on('songChanged', (queue, newSong, oldSong) => console.log(`${newSong} is now playing.`))
    .on('songFirst',  (queue, song) => console.log(`Started playing ${song}.`))
    .on('clientDisconnect', (queue) => console.log(`I was kicked from the Voice Channel, queue ended.`))
    .on('clientUndeafen', (queue) => console.log(`I got undefeanded.`))
    .on('error', (error, queue) => {
        try {
            console.log(`Error: ${error} in ${queue.guild.name}`);
        } catch (error) {
            console.log('something went very wrong');
            console.log(error);
        }
    });


// client.events = new Discord.Collection();
// client.buttons = new Discord.Collection();

// ['loader', 'event_handler'].forEach(handler =>{
//     require(`./handlers/${handler}`)(client, Discord)
// })


client.login(process.env.DISCORD_TOKEN);