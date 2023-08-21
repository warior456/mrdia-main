const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const User = require("../../../schemas/user");

module.exports = {
	name: "favorites", //extras: commandOptions
	aliases: ["favs"],
	options: [
		//optional
		{
			name: "userid",
			type: ApplicationCommandOptionType.String,
			description: "Give the userid",
			required: false,
		},
	],
	description: "Shows a list of your favorites",
	category: "music",
	run: async (client, message, args) => {
		//async only if deferring
		await Reply.deferReply(message, false); //only use if command can take long
		requesteduserid = args[0];

		if (!requesteduserid) requesteduserid = message.member.user.id;
        requestedUserName = requesteduserid;

		let userProfile = await User.findOne({ userId: requesteduserid });
        if(!userProfile) return "User not found"
        if(!userProfile.userFavoriteLinks[0]) return "User has no favorited songs"

        footer = requesteduserid
		description = makeDescription(userProfile);

		favoritesEmbed = await makeFavoritesEmbed(client, description, footer, requestedUserName);
		Reply.editReply(message, { embeds: [favoritesEmbed], components: addButtons() });
	},
};

function makeDescription(userProfile) {
	let description = "";
	for (let i = 0; i < userProfile.userFavoriteLinks.length; i++) {
		description += `\`${i + 1}.\` [${userProfile.userFavoriteNames[i]}](${userProfile.userFavoriteLinks[i]})\n \n`
	}
    return description
}

function makeFavoritesEmbed(client, description, footer, requestedUserName) {
	favoritesEmbed = new EmbedBuilder()
		.setColor(client.config.musicCommandColor)
		.setTitle(`${requestedUserName} favorites`)
		.setDescription(description)
		.setFooter({ text: footer })
		.setTimestamp();
	return favoritesEmbed;
}
function addButtons() {
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("load_favorites").setLabel("Load").setStyle(ButtonStyle.Success)
	);
	return [row];
}
