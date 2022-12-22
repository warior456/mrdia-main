const { makeQueueEmbed } = require("../../functions/music/showQueueFunction");
const Reply = require("../../structures/handlers/replyHandler");

module.exports = {
	name: "previous_page_q",
	returnErrors: false, //commandOptions
	//ownerOnly: true,
	run: async (client, message) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.send(message, { content: `There is nothing playing right now!`, ephemeral: true });
		await Reply.deferUpdate(message); //Reply.follow to send messages and Reply.editReply to edit current message

		page = pageResolver(message, queue);
		embed = makeQueueEmbed(client, queue, page);
		Reply.editReply(message, { embeds: embed });
	},
};

function pageResolver(message, queue) {
	let maxPage = Math.ceil((queue.songs.length - 1) / 10);
	let page = { requested: getPageFromEmbed(message), max: maxPage };
	page.requested--; //previous page
	if (page.max === 0) page.max = 1; //prevent 1/0
	if (page.requested > page.max) page.requested = page.max; //prevent overflow
	if (page.requested <= 0) page.requested = 1; //prevent negative
	return page;
}

function getPageFromEmbed(message) {
	footer = message.message.embeds[0].footer.text;
	embedPage = footer.match(/Page: (\d*)/)[1];
	return embedPage;
}
