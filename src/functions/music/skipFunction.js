async function skipSong(userId, queue) {
	song = queue.songs[0];

    let userCount = queue.voiceChannel.members.size;
	let userR = Math.floor(userCount / 2);

	if (song.metadata.skipVotes.includes(userId))
		return { content: `you already voted, ${song.metadata.skipVotes.length}/${userR}`, ephemeral: true };

	await song.metadata.skipVotes.push(userId);


	if (song.metadata.skipVotes.length >= userR) {
		if(!queue.songs[1]){
			queue.stop()
			return 'Skipped song'
		} 
		skippedTo = await queue.skip();
		skipMsg = `Skipped song, Now playing: **${skippedTo.name}**`;
		song.metadata.skipVotes = []
		return skipMsg;
	} else {
		skipMsg = `Voted: ${song.metadata.skipVotes.length}/${userR}`;
		return skipMsg;
	}
}

module.exports = {
	skipSong,
};
