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
        required: true
    }],
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        Reply.defer(message)
        //return Reply.send('This feature is currently WIP')
        // if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')

        const searches = await LyricsClient.songs.search(args.join(' '));

        //Pick first one
        const firstSong = searches[0];

        const lyrics = await firstSong.lyrics();
        const embed = new MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`**Lyrics of the Song:**`)
            .setDescription(lyrics)

        Reply.editReply(message, { embeds: [embed] })


    }
}
