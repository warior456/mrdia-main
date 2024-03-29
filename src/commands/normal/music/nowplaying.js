const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle , EmbedBuilder} = require("discord.js");
const { nowPlaying } = require("../../../functions/music/nowPlayingFunction");
module.exports = {
	name: "nowplaying", //extras: commandOptions
	aliases: ["np"],
	description: "Shows the currently playing song",
	category: "music",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.send(message, {content: `There is nothing playing right now!`, ephemeral: true});
		await Reply.deferReply(message, false); //only use if command can take long
		embed = nowPlaying(client, queue)
		Reply.editReply(message, { embeds: embed, components: addButtons() });
	},
};

function addButtons() {
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("refresh_np").setLabel("Refresh").setStyle(ButtonStyle.Primary), //blue
		new ButtonBuilder().setCustomId("save_dm").setLabel("Send in dm").setStyle(ButtonStyle.Success), //gray
		new ButtonBuilder().setCustomId("savefavorite").setLabel("Add to favorites").setStyle(ButtonStyle.Success), // green
		new ButtonBuilder().setCustomId("end").setLabel("End interaction").setStyle(ButtonStyle.Danger) //red
	);

	const row2 = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("previous").setLabel("Previous song").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId("pause_resume").setLabel("Pause or Resume song").setStyle(ButtonStyle.Secondary),
		new ButtonBuilder().setCustomId("skip").setLabel("Next song").setStyle(ButtonStyle.Primary)
	);
	return [row, row2];
}
