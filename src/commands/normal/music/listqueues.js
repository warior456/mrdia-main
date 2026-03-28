const Reply = require("../../../structures/handlers/replyHandler");
const {
	EmbedBuilder,
	ApplicationCommandOptionType,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");
const Queue = require("../../../schemas/queue");
const fs = require("fs").promises;
const path = require("path");

module.exports = {
	name: "listqueues",
	aliases: ["listqs", "listq"],
	options: [
		{
			name: "page",
			type: ApplicationCommandOptionType.Integer,
			description: "Page number to display (10 queues per page)",
			required: false,
		},
		{
			name: "legacy",
			type: ApplicationCommandOptionType.Boolean,
			description: "Show legacy CSV queues instead of database queues",
			required: false,
		},
	],
	description: "Shows all saved queues for this server (MongoDB or legacy CSV)",
	category: "music",
	run: async (client, message, args) => {
		try {
			await Reply.deferReply(message, false);
			const page = parseInt(args[0]) || 1;
			const isLegacy = args[1] === "true" || args[1] === true;
			await listQueues(message, client, page, isLegacy);
		} catch (error) {
			console.error(error);
			Reply.editReply(message, { content: "An error occurred while listing queues", ephemeral: true });
		}
	},
};

module.exports.listQueues = listQueues;

async function listQueues(message, client, requestedPage, isLegacy) {
	if (isLegacy) {
		return await listLegacyQueues(message, client, requestedPage);
	}

	// List from MongoDB
	try {
		const queues = await Queue.find({ serverId: message.guild.id }).sort({ updatedAt: -1 });

		if (queues.length === 0) {
			return Reply.editReply(message, {
				content: "No saved queues found in database for this server. Use `/listqueues legacy:true` to see legacy CSV queues.",
				ephemeral: true,
			});
		}

		const itemsPerPage = 10;
		const maxPage = Math.ceil(queues.length / itemsPerPage);
		const page = Math.max(1, Math.min(requestedPage, maxPage));

		if (requestedPage > maxPage) {
			return Reply.editReply(message, {
				content: `There are only ${maxPage} pages`,
				ephemeral: true,
			});
		}

		// Get queues for current page
		const startIdx = (page - 1) * itemsPerPage;
		const endIdx = startIdx + itemsPerPage;
		const pageQueues = queues.slice(startIdx, endIdx);

		let queueList = "";
		for (let i = 0; i < pageQueues.length; i++) {
			const q = pageQueues[i];
			queueList += `${startIdx + i + 1}. **${q.queueName}** (${q.songs.length} songs) - by <@${q.queueOwnerId}>\n`;
		}

		const queEmbed = new EmbedBuilder()
			.setTitle("Saved Queues (Database)")
			.setColor(client.config.musicCommandColor)
			.setDescription(queueList || "No queues on this page")
			.setFooter({ text: `Page ${page}/${maxPage}` });

		Reply.editReply(message, { embeds: [queEmbed], components: makeQueueListButtons(page, maxPage) });
	} catch (error) {
		console.error("Error reading queues from database:", error);
		throw error;
	}
}

async function listLegacyQueues(message, client, requestedPage) {
	const guildDir = path.join(process.cwd(), "guildData", message.guild.id);

	let queues = [];
	try {
		// Ensure directory exists
		try {
			const files = await fs.readdir(guildDir);
			queues = files.filter((file) => file.endsWith(".csv"));
		} catch (err) {
			if (err.code !== "ENOENT") throw err;
			// Directory doesn't exist
			await fs.mkdir(guildDir, { recursive: true });
		}
	} catch (err) {
		console.error("Error reading legacy queue directory:", err);
		throw err;
	}

	if (queues.length === 0) {
		return Reply.editReply(message, {
			content: "No legacy CSV queues found for this server",
			ephemeral: true,
		});
	}

	const itemsPerPage = 10;
	const maxPage = Math.ceil(queues.length / itemsPerPage);
	const page = Math.max(1, Math.min(requestedPage, maxPage));

	if (requestedPage > maxPage) {
		return Reply.editReply(message, {
			content: `There are only ${maxPage} pages`,
			ephemeral: true,
		});
	}

	// Get queues for current page
	const startIdx = (page - 1) * itemsPerPage;
	const endIdx = startIdx + itemsPerPage;
	const pageQueues = queues.slice(startIdx, endIdx);

	let queueList = "";
	for (let i = 0; i < pageQueues.length; i++) {
		queueList += `${startIdx + i + 1}. ${pageQueues[i]}\n`;
	}

	const queEmbed = new EmbedBuilder()
		.setTitle("Saved Queues (Legacy CSV)")
		.setColor(client.config.musicCommandColor)
		.setDescription(queueList || "No queues on this page")
		.setFooter({ text: `Page ${page}/${maxPage} - Use /loadqueue to migrate to database` });

	Reply.editReply(message, { embeds: [queEmbed], components: makeQueueListButtons(page, maxPage) });
}

function makeQueueListButtons(page, maxPage) {
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("previous_page_listqueues")
			.setLabel("Previous page")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page <= 1),
		new ButtonBuilder()
			.setCustomId("next_page_listqueues")
			.setLabel("Next page")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page >= maxPage),
		new ButtonBuilder().setCustomId("end").setLabel("End interaction").setStyle(ButtonStyle.Danger)
			
	);

	return [row];
}
