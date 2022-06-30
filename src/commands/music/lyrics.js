
const axios = require("axios");



module.exports = {
    name: 'lyrics',
    aliases: [],
    description: 'gives the lyrics for a song',
    category: 'music',
    run: async (message, client, Discord, args, cmd) => {

        // if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        const searchOptions = {
            method: 'GET',
            url: 'https://genius.p.rapidapi.com/search',
            params: { q: `${args.join(' ')}` },
            headers: {
                'X-RapidAPI-Key': '9c7b9116c9msh7ae5f48655b7a57p16be1bjsn21d5d5d4aad2',
                'X-RapidAPI-Host': 'genius.p.rapidapi.com'
            }
        };
        let songId = getSongId(searchOptions)
        const songOptions = {
            method: 'GET',
            url: `https://genius.p.rapidapi.com/songs/${songId}`,
            headers: {
                'X-RapidAPI-Key': '9c7b9116c9msh7ae5f48655b7a57p16be1bjsn21d5d5d4aad2',
                'X-RapidAPI-Host': 'genius.p.rapidapi.com'
            }
        };
        
        let lyricsUrl = getLyricsUrl(songId)
        let lyrics = getLyrics(lyricsUrl)
    }
}



function getSongId(searchOptions) {
    axios.request(searchOptions).then(function (response) {
        songId = response.response.hits[0].result.id
        console.log(songId);
        return songId
    }).catch(function (error) {
        console.error(error);
    });
}

function getLyricsUrl(songOptions) {
    axios.request(songOptions).then(function (response) {
        lyricsUrl = response.response.song.url
        console.log(lyricsUrl);
        return lyricsUrl
    }).catch(function (error) {
        console.error(error);
    });
}

function getLyrics(songId) {
    getLyricsUrl(songId)
}

// 9c7b9116c9msh7ae5f48655b7a57p16be1bjsn21d5d5d4aad2