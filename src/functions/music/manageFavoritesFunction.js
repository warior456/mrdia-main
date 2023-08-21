const { isNatural } = require("../utilities");
const User = require('../../schemas/user')

async function saveFavorite(message, song) {
	let userProfile = await User.findOne({ userId: message.member.user.id });

	if (!userProfile) {
		userProfile = await createUser(message);
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
	saveFavorite,
	removeFavorite,
};

async function createUser(message) {
	userProfile = await new User({
		_id: mongoose.Types.ObjectId(),
		userId: message.member.user.id,
		userName: message.member.user.tag,
		userIcon: "todo",
	});
	return userProfile;
}

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
