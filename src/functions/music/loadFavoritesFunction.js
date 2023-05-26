const { play } = require('../../functions/music/playFunction');
const User = require('../../schemas/user')

async function loadFavorites(client, message, requesteduserid, voiceChannel){
    let userProfile = await User.findOne({ userId: requesteduserid });

    if(!userProfile) return "User not found"
    if(!userProfile.userFavoriteLinks[0]) return "User has no favorited songs"

    let song = userProfile.userFavoriteLinks[0];
    //song.split("&list=")
    await client.distube.play(voiceChannel, song, {
        member: message.member,
        textChannel: message.channel,
        metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
    });
    for (let i = 1; i < userProfile.userFavoriteLinks.length; i++) {
        song = userProfile.userFavoriteLinks[i];
        //song.split("&list=")
        client.distube.play(voiceChannel, song, {
			member: message.member,
			textChannel: message.channel,
			metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
		});
        
    }

    return "Favorites loaded"
    
}


module.exports = {
    loadFavorites
};



