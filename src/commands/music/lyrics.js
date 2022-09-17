const Reply = require('../../Structures/Handlers/replyHandler')
const axios = require("axios");

const Genius = require("genius-lyrics");

//todo working
//todo options

module.exports = {
    name: 'lyrics',
    aliases: [],
    description: 'wip',
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {
        return Reply.send('This feature is currently WIP')
        // if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')

        const searches = await LyricsClient.songs.search("sasageyo");

        //Pick first one
        const firstSong = searches[0];
        console.log("About the Song:\n", firstSong, "\n");
        
        // Ok lets get the lyrics
        const lyrics = await firstSong.lyrics();
        console.log("Lyrics of the Song:\n", lyrics, "\n");
    }
}

// 9c7b9116c9msh7ae5f48655b7a57p16be1bjsn21d5d5d4aad2