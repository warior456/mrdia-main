const axios = require("axios");

module.exports = {
    name: 'lyrics',
    aliases: [],
    description: 'clear messages!',

    run: async (message, args, cmd, client, Discord) => {
        
        // if (!message.member.voice.channel && message.author.id != process.env.OWNER) return message.channel.send('Join a voice channel first!')

        axios.request(options).then(function (response) {
            console.log(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }
}

const options= {
    method: 'GET',
    url: 'https://genius.p.rapidapi.com/search',
    params: { q: `colors code geass` },
    headers: {
        'X-RapidAPI-Key': '9c7b9116c9msh7ae5f48655b7a57p16be1bjsn21d5d5d4aad2',
        'X-RapidAPI-Host': 'genius.p.rapidapi.com'
    }
};

