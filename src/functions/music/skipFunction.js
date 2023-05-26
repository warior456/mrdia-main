async function skipSong(userId, queue, message) {
	song = queue.songs[0];

	let userCount = queue.voiceChannel.members.size;
	let userR = Math.floor(userCount / 2);

	if (message.member.user.id == client.config.owner) return skip(queue, song);

	if (song.metadata.skipVotes.includes(userId))
		return { content: `you already voted, ${song.metadata.skipVotes.length}/${userR}`, ephemeral: true };

	await song.metadata.skipVotes.push(userId);

	if (song.metadata.skipVotes.length >= userR) {
		return skip(queue, song);
	} else {
		skipMsg = `Voted (skip): ${song.metadata.skipVotes.length}/${userR}`;
		return skipMsg;
	}
}

async function skip(queue, song) {
	if (!queue.songs[1]) {
		queue.stop();
		return "Skipped song";
	}
	skippedTo = await queue.skip();
	skipMsg = `Skipped song, Now playing: **${skippedTo.name}**`;
	song.metadata.skipVotes = [];
	return skipMsg;
}

module.exports = {
	skipSong,
};
