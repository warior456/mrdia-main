const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const { makeQueueEmbed } = require("../../../functions/music/showQueueFunction");
module.exports = {
	name: "queue", //extras: commandOptions
	aliases: ["q"],
	options: [
		//optional
		{
			name: "page",
			type: ApplicationCommandOptionType.Integer,
			description: "The page of the queue",
			required: false,
		},
	],
	description: "Shows the queue of this server",
	category: "music",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.send(message, { content: `There is nothing playing right now!`, ephemeral: true });
		await Reply.deferReply(message, false); //only use if command can take long

		let page = pageResolver(queue, args);
		let embed = makeQueueEmbed(client, queue, page);
		Reply.editReply(message, { embeds: embed, components: addButtons() });
	},
};

function pageResolver(queue, args) {
	if (!args[0]) args[0] = 1; //prevent error on no args
	let maxPage = Math.ceil((queue.songs.length - 1) / 10);

	let page = { requested: [args[0]], max: maxPage };

	if (page.max === 0) page.max = 1; //prevent 1/0
	if (page.requested > page.max) page.requested = page.max; //prevent overflow
	if (page.requested <= 0) page.requested = 1; //prevent negative
    return page
}

function addButtons() {
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("refresh_q").setLabel("Refresh").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId("previous_page_q").setLabel("Previous page").setStyle(ButtonStyle.Secondary),
		new ButtonBuilder().setCustomId("next_page_q").setLabel("Next page").setStyle(ButtonStyle.Secondary),
		new ButtonBuilder().setCustomId("end").setLabel("End interaction").setStyle(ButtonStyle.Danger)
	);
	const row2 = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("previous").setLabel("Previous song").setStyle(ButtonStyle.Primary),
		new ButtonBuilder().setCustomId("pause_resume").setLabel("Pause or Resume song").setStyle(ButtonStyle.Secondary),
		new ButtonBuilder().setCustomId("skip").setLabel("Next song").setStyle(ButtonStyle.Primary)
	);
	const row3 = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("save_dm").setLabel("Send current song in dm").setStyle(ButtonStyle.Success),
		new ButtonBuilder().setCustomId("savefavorite").setLabel("Add current song to favorites").setStyle(ButtonStyle.Success)
	);
	//can have up to 5 rows
	return [row, row2, row3];
}
