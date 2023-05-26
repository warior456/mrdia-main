async function play(client, message, args, voiceChannel) {
    try {
        args = args.join()
    } catch{

    }
	await client.distube.play(voiceChannel, args, {
		member: message.member,
		textChannel: message.channel,
		metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: false },
	});

	specials(client, message, voiceChannel);
}

async function specials(client, message, voiceChannel) {
	let max = 5;
	let random = Math.floor(Math.random() * max);

	if (random === 4) {
		const queue = await client.distube.getQueue(message);

		// one if five
		const date = new Date();
		if (date.getMonth() != 11 || (date.getDate() != 25 && date.getDate() != 24)) return console.log("returned back from Christmas special"); //only on this date reason for this order is speed

		await client.distube.play(voiceChannel, "https://www.youtube.com/watch?v=g-OF7KGyDis", {
			member: message.member,
			textChannel: message.channel,
			metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
		});

		if (!queue.songs[2]) {
			await queue.skip();
		}
	}

	if (random === 4 || random === 3 || random === 2) {
		const queue = await client.distube.getQueue(message);
		// one if five
		const date = new Date();
		if (date.getMonth() != 3 || date.getDate() != 1) return console.log("returned back from April fools"); //only on this date reason for this order is speed

		await client.distube.play(voiceChannel, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", {
			member: message.member,
			textChannel: message.channel,
			metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
		});

		if (!queue.songs[2]) {
			await queue.skip();
		}
	}
}

module.exports = {
	play,
    specials,
};
