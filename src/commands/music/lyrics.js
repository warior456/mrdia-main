const { MessageEmbed } = require('discord.js');
const Reply = require('../../Structures/Handlers/replyHandler')
const axios = require("axios");

const Genius = require("genius-lyrics");

module.exports = {
    name: 'lyrics',
    aliases: [],
    description: 'Gives the lyrics to a song',
    cooldown: 15000,
    options: [{
        name: "name",
        type: "STRING",
        description: "Give the song name",
        required: false
    }],
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        await Reply.deferReply(message, false)
        //return Reply.send('This feature is currently WIP')
        // if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')
        console.log(args)
        if (!args[0]) {
            let guildQueue = client.player.getQueue(message.guild.id);
            if (guildQueue) {
                args = [guildQueue.nowPlaying.name]
            } else return Reply.editReply(message, `There is no song playing please provide a song to search for`)
        }
        console.log(args)
        const searches = await LyricsClient.songs.search(args.join(' '));

        //Pick first one
        const firstSong = searches[0];
        if (!firstSong) {
            return Reply.editReply(message, `Couldn't find any lyrics matching your search`)
        }
        const lyrics = await firstSong.lyrics();
        const embed = new MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`**Lyrics of the Song:**`)
            .setDescription(lyrics)

        Reply.editReply(message, { embeds: [embed] })


    }
}


