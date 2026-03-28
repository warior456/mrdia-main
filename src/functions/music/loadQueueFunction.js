const Reply = require("../../structures/handlers/replyHandler");
const fs = require('fs');
const File = require("../File");
const Queue = require("../../schemas/queue");

function loadQueue(queueName, client, message, args) {
	queueName = args[0];
	if (!args[1]) args[1] = message.guild.id;
	serverId = args[1];
	if (args[1] === true || args[1] === false) {
		if (args[2]) serverId = args[2];
		args[2] = args[1];
		args[1] = message.guild.id;
	}
	if (!args[2]) args[2] = false;
	const legacy = args[2];

	const guildId = args[1];
	console.log("Loading queue:", { queueName, guildId, legacy });

	if (legacy === true) {
		loadQueueLegacy(message, client, args);
	} else {
		loadQueueNew(queueName, guildId, client, message);
	}
}

module.exports = {
	loadQueue,
};

async function loadQueueLegacy(message, client, args) {
	try {
		if (!args[0]) {
			return Reply.editReply(message, "Please provide a name");
		}
		if (!fs.existsSync(`./guildData`)) {
			fs.mkdirSync(`./guildData`);
		}
		if (!fs.existsSync(`./guildData/${message.guild.id}`)) {
			fs.mkdirSync(`./guildData/${message.guild.id}`);
		}
		if (!fs.existsSync(`./guildData/${message.guild.id}/${args[0]}.csv`)) {
			return Reply.editReply(message, { content: `Error- That queue doesn't exist!`, ephemeral: true });
		}
		if (!message.member.voice.channel) {
			return Reply.editReply(message, { content: "Error- Join a voice channel first!", ephemeral: true });
		}
		try {
			Reply.editReply(message, "loading queue...");
			try {
				const loQueue = await File.read(`./guildData/${message.guild.id}/${args[0]}.csv`);
				let loSongs = loQueue.split(/\n|;/g).filter((s) => s);

				if (loSongs.length === 0) {
					return Reply.editReply(message, { content: "Queue file is empty!", ephemeral: true });
				}

				await client.distube.play(message.member.voice.channel, loSongs[0], {
					member: message.member,
					textChannel: message.channel,
					metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
				});

				for (let i = 2; i < loSongs.length - 1; i = i + 2) {
					try {
						client.distube.play(message.member.voice.channel, loSongs[i], {
							member: message.member,
							textChannel: message.channel,
							metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
						});
					} catch (error) {
						console.log(error);
					}
				}

				Reply.follow(message, `**[${args[0]}]** has been loaded`);
			} catch (error) {
				console.log(error);
				Reply.follow(message, `something went wrong while loading the queue`);
			}
		} catch (error) {
			console.log(error);
			Reply.follow(message, "unable to load queue");
		}
	} catch (error) {
		console.log(error);
	}
}

async function loadQueueNew(queueName, guildId, client, message) {
	try {
		if (!message.member.voice.channel) {
			return Reply.editReply(message, { content: "Error- Join a voice channel first!", ephemeral: true });
		}

		const queue = await Queue.findOne({
			queueName: queueName,
			serverId: guildId,
		});

		if (!queue || queue.songs.length === 0) {
			return Reply.editReply(message, { content: "Queue not found or is empty!", ephemeral: true });
		}

		Reply.editReply(message, "loading queue...");

		// Load first song
		await client.distube.play(message.member.voice.channel, queue.songs[0].url, {
			member: message.member,
			textChannel: message.channel,
			metadata: {
				messageObject: message,
				skipVotes: [],
				previousVotes: [],
				ignoremessage: true,
				requestedBy: queue.songs[0].requestedBy,
				requestedByName: queue.songs[0].requestedByName,
			},
		});

		// Load remaining songs
		for (let i = 1; i < queue.songs.length; i++) {
			try {
				client.distube.play(message.member.voice.channel, queue.songs[i].url, {
					member: message.member,
					textChannel: message.channel,
					metadata: {
						messageObject: message,
						skipVotes: [],
						previousVotes: [],
						ignoremessage: true,
						requestedBy: queue.songs[i].requestedBy,
						requestedByName: queue.songs[i].requestedByName,
					},
				});
			} catch (error) {
				console.log(error);
			}
		}

		Reply.follow(message, `**[${queueName}]** has been loaded (${queue.songs.length} songs)`);
	} catch (error) {
		console.log(error);
		return Reply.editReply(message, { content: "Error while loading queue!", ephemeral: true });
	}
}


