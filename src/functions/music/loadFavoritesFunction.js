const { play } = require('../../functions/music/playFunction');
const User = require('../../schemas/user')

async function loadFavorites(client, message, requesteduserid, voiceChannel){
    let userProfile = await User.findOne({ userId: requesteduserid });

    if(!userProfile) return "User not found"
    if(!userProfile.userFavoriteLinks[0]) return "User has no favorited songs"

    let loadedCount = 0;
    for (let i = 0; i < userProfile.userFavoriteLinks.length; i++) {
        const song = userProfile.userFavoriteLinks[i];
        try {
            await client.distube.play(voiceChannel, song, {
                member: message.member,
                textChannel: message.channel,
                metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
            });
            loadedCount++;
        } catch (err) {
            console.warn(`[LoadFavorites] Skipping unplayable song "${song}":`, err.message || err);
        }
    }

    return loadedCount > 0 ? "Favorites loaded" : "Could not load any songs from favorites";
}


module.exports = {
    loadFavorites
};



