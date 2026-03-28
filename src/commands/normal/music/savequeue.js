const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");
const Queue = require("../../../schemas/queue");
const mongoose = require("mongoose");

module.exports = {
	name: "savequeue",
	aliases: ["sq"],
	options: [
		{
			name: "name",
			type: ApplicationCommandOptionType.String,
			description: "Give the queue a name",
			required: true,
		},
	],
	description: "Saves the current queue with a given name to database",
	category: "music",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);

		if (!message.member?.voice?.channel) {
			return Reply.send(message, { content: "Join a voice channel first!", ephemeral: true });
		}

		if (!queue || queue.songs.length === 0) {
			return Reply.send(message, { content: "There are no songs in the queue!", ephemeral: true });
		}

		if (!args[0]) {
			return Reply.send(message, { content: "Please provide a name for the queue", ephemeral: true });
		}

		try {
			await saveQueueToDb(message, queue, args[0]);
			Reply.send(message, { content: `**[${args[0]}]** has been saved!`, ephemeral: true });
		} catch (error) {
			console.error(error);
			Reply.send(message, { content: "An error occurred while saving the queue", ephemeral: true });
		}
	},
};

async function saveQueueToDb(message, queue, queueName) {
	// Check if queue already exists
	let savedQueue = await Queue.findOne({
		serverId: message.guild.id,
		queueName: queueName,
		queueOwnerId: message.member.user.id,
	});

	// Build songs array
	const songs = queue.songs.map((song) => ({
		url: song.url,
		name: song.name,
		requestedBy: song.metadata?.requestedBy || message.member.user.id,
		requestedByName: song.metadata?.requestedByName || message.member.user.username,
	}));

	if (savedQueue) {
		// Update existing queue
		savedQueue.songs = songs;
		savedQueue.updatedAt = new Date();
		await savedQueue.save().catch(console.error);
	} else {
		// Create new queue
		savedQueue = await new Queue({
			_id: new mongoose.Types.ObjectId(),
			queueName: queueName,
			serverId: message.guild.id,
			queueOwnerId: message.member.user.id,
			queueOwnerName: message.member.user.username,
			songs: songs,
		});
		await savedQueue.save().catch(console.error);
	}
}
