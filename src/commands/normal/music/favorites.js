const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require("../../../schemas/user");

module.exports = {
	name: "favorites", //extras: commandOptions
	aliases: ["favs"],
	options: [
		{
			name: "page",
			type: ApplicationCommandOptionType.Integer,
			description: "Page number to display (10 favorites per page)",
			required: false,
		},
		{
			name: "userid",
			type: ApplicationCommandOptionType.String,
			description: "Give the user ID or mention",
			required: false,
		},
	],
	description: "Shows a list of your favorites",
	category: "music",
	run: async (client, message, args) => {
		try {
			await Reply.deferReply(message, false);
			const { page, requestedUserId } = parseArgs(message, args);
			await listFavorites(message, client, page, requestedUserId);
		} catch (error) {
			console.error("Error in favorites command:", error);
			Reply.editReply(message, { content: "An error occurred while fetching favorites.", ephemeral: true });
		}
	},
};

module.exports.listFavorites = listFavorites;

function parseArgs(message, args) {
	let page = 1;
	let requestedUserId = message.member?.user?.id || message.author?.id || message.user?.id;

	if (!args || args.length === 0) {
		return { page, requestedUserId };
	}

	for (const arg of args) {
		if (!arg) continue;
		const trimmed = String(arg).trim();
		const mentionMatch = trimmed.match(/^<@!?(\d+)>$/);
		if (mentionMatch) {
			requestedUserId = mentionMatch[1];
		} else if (/^\d{16,20}$/.test(trimmed)) {
			requestedUserId = trimmed;
		} else {
			const parsedNum = parseInt(trimmed, 10);
			if (!isNaN(parsedNum) && parsedNum > 0) {
				page = parsedNum;
			}
		}
	}

	return { page, requestedUserId };
}

async function listFavorites(message, client, requestedPage, requestedUserId) {
	if (!requestedUserId) {
		requestedUserId = message.member?.user?.id || message.author?.id || message.user?.id;
	}

	const userProfile = await User.findOne({ userId: requestedUserId });
	if (!userProfile) {
		return Reply.editReply(message, { content: "User not found or has no profile saved.", ephemeral: true });
	}

	if (!userProfile.userFavoriteLinks || userProfile.userFavoriteLinks.length === 0) {
		return Reply.editReply(message, { content: "User has no favorited songs.", ephemeral: true });
	}

	let discordUser = client.users.cache.get(requestedUserId);
	if (!discordUser) {
		discordUser = await client.users.fetch(requestedUserId).catch(() => null);
	}

	let requestedUserName = discordUser?.username;
	if (!requestedUserName) {
		requestedUserName = userProfile.userName ? userProfile.userName.split("#")[0] : `<@${requestedUserId}>`;
	} else if (userProfile.userName !== requestedUserName) {
		userProfile.userName = requestedUserName;
		userProfile.save().catch(console.error);
	}

	const itemsPerPage = 10;
	const totalFavorites = userProfile.userFavoriteLinks.length;
	const maxPage = Math.ceil(totalFavorites / itemsPerPage) || 1;
	const page = Math.max(1, Math.min(requestedPage || 1, maxPage));

	const startIdx = (page - 1) * itemsPerPage;
	const endIdx = Math.min(startIdx + itemsPerPage, totalFavorites);

	let description = "";
	for (let i = startIdx; i < endIdx; i++) {
		const songName = userProfile.userFavoriteNames?.[i] || "Unknown Title";
		const songUrl = userProfile.userFavoriteLinks[i];
		description += `\`${i + 1}.\` [${songName}](${songUrl})\n\n`;
	}

	const footer = `Page ${page}/${maxPage} • ID: ${requestedUserId}`;

	const favoritesEmbed = new EmbedBuilder()
		.setColor(client.config.musicCommandColor)
		.setTitle(`${requestedUserName}'s favorites`)
		.setDescription(description || "No favorites on this page.")
		.setFooter({ text: footer })
		.setTimestamp();

	return Reply.editReply(message, {
		embeds: [favoritesEmbed],
		components: makeFavoritesButtons(page, maxPage),
	});
}

function makeFavoritesButtons(page, maxPage) {
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("previous_page_favorites")
			.setLabel("Previous page")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page <= 1),
		new ButtonBuilder()
			.setCustomId("next_page_favorites")
			.setLabel("Next page")
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(page >= maxPage),
		new ButtonBuilder()
			.setCustomId("load_favorites")
			.setLabel("Load")
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId("end")
			.setLabel("End interaction")
			.setStyle(ButtonStyle.Danger)
	);
	return [row];
}
