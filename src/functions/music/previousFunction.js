async function previousSong(userId, queue) {
	song = queue.songs[0];

	let userCount = queue.voiceChannel.members.size;
	let userR = Math.floor(userCount / 2);

	if (song.metadata.previousVotes.includes(userId))
		return { content: `you already voted, ${song.metadata.previousVotes.length}/${userR}`, ephemeral: true };

	if (!queue.previousSongs[0]) {
		return { content: "No previous song", ephemeral: true };
	}
	
	song.metadata.previousVotes.push(userId);

	if (song.metadata.previousVotes.length >= userR) {
		revertedTo = await queue.previous();
		backMsg = `Previous song, Now playing: **${revertedTo.name}**`;
		song.metadata.previousVotes = [];
		return backMsg;
	} else {
		backMsg = `Voted (previous): ${song.metadata.previousVotes.length}/${userR}`;
		return backMsg;
	}
}

module.exports = {
	previousSong,
};
