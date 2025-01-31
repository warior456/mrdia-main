const Reply = require("../../structures/handlers/replyHandler");
const fs = require('fs');
const File = require("../File");
const queue_schema = require("../../schemas/queue");
function loadQueue(queueName, client, message, args) {

	queueName = args[0]
	if(!args[1]) args[1] = message.guild.id
	serverId = args[1]
	if(args[1] === true || args[1] === false){//todo test this
		if(args[2]) serverId = args[2]
		args[2] = args[1]
		args[1] = message.guid.id
	} 
	if(!args[2]) args[2] = false
	legacy = args[2]

	guildId = args[1]
	console.log(legacy)
	legacy = true
	if ((legacy === true)) loadQueueLegacy(message, client, args);
	if ((legacy === false)) loadQueueNew(queueName, guildId, message);
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
async function loadQueueNew(queueName, guildId, message) {
	try {
		const queue = await queue_schema.findOne({ serverId: guildId, queueName });
		if(!queue) return 'Queue not found!'

		for (let i = 0; i < queue.songUrls.length(); i++) {
			song = songUrls[i];
			await client.distube.play(voiceChannel, song, {
				member: message.member,
				textChannel: message.channel,
				metadata: { messageObject: message, skipVotes: [], previousVotes: [], ignoremessage: true },
			});
		return `${queueName} loaded`
	  }
	}	catch (error) {
		console.log(error)
		return 'error while loading queue'
	  }
}


