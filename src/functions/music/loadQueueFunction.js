const Reply = require("../../structures/handlers/replyHandler");
const fs = require('fs');
const File = require("../File")
function loadQueue(queueName, serverId, legacy, client, message, args) {
	if ((legacy = true)) loadQueueLegacy(message, client, args);
	if ((legacy = false)) loadQueueNew(queueName, serverId, message);
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
			fs.mkdirSync(`./guidData`);
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
			Reply.editReply(message, "loading queue");
			try {
				const loQueue = await File.read(`./guildData/${message.guild.id}/${args[0]}.csv`);
				let loSongs = loQueue.split(/\n|;/g).filter((s) => s);
				await client.distube.play(message.member.voice.channel, loSongs[0], {
					member: message.member,
					textChannel: message.channel,
					metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
				});
				for (var i = 2; i < loSongs.length - 1; i = i + 2) {
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
				Reply.follow(message, `**[${args[0]}]** has been  loaded`);
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
async function loadQueueNew(queueName, serverId, message) {
	//WIP
}


