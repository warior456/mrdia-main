const { isNatural } = require("../utilities");
const queueSchema = require('../../schemas/queue')

async function createQueue(message, queueName) {//done
	queue_database = await new queueSchema({
		_id: mongoose.Types.ObjectId(),
		queueName: queueName,
		serverId: message.guild.id,
		queueOwnerId: message.member.user.id,
        songUrls: []
	});
	return queue_database;
}

async function saveQueue(message, queue_to_save, queueName) {
	let queue_database = await queueSchema.findOne({$elemMatch :{ queueName: queueName, serverId: message.guild.id }});


	if (!queue_database) {
        console.log("created a queue for the database")
		queue_database = await createQueue(message);
        save(queue_database)

	}
    console.log(queue_database)
    if(queue_database.queueOwnerId != message.member.user.id){
        return `There is already a queue with this name that is not yours`
    }else{
        return `overiding queue`
    }

	if (!userProfile.userFavoriteLinks.includes(song.url)) {
		userProfile.userFavoriteLinks.unshift(song.url);
		userProfile.userFavoriteNames.unshift(song.name);
		await save(userProfile);
		return { content: `Added **${userProfile.userFavoriteNames[0]}** to your favorites!`, ephemeral: true };
	} else {
		return { content: `**${userProfile.userFavoriteNames[0]}** is already a favorite!`, ephemeral: true };
	}
}

async function removeFavorite(message, songNumberOrUrl) {
	let userProfile = await User.findOne({ userId: message.member.user.id });

	if(!userProfile.userFavoriteLinks) return "nothing, You have no favorites!"

	if (isNatural(songNumberOrUrl) && userProfile.userFavoriteLinks.length >= songNumberOrUrl && songNumberOrUrl > 0) {
		content = await removeNameAndUrl(userProfile, songNumberOrUrl - 1);
		return `Succesfully removed ${content}`;
	}

	const index = userProfile.userFavoriteLinks.indexOf(songNumberOrUrl);
	if (!index) return "nothing, Please provide a valid input!";
	content = await removeNameAndUrl(userProfile, index);
	return `Succesfully removed ${content}`;
}

module.exports = {
	saveQueue,
	removeFavorite,
};




async function save(userProfile) {
	await userProfile.save().catch(console.error);
	return userProfile.userFavoriteNames[0];
}

async function removeNameAndUrl(userProfile, index) {
	userProfile.userFavoriteLinks.splice(index, 1);
	const removed = userProfile.userFavoriteNames.splice(index, 1);
	await userProfile.save().catch(console.error);
	return removed;
}
