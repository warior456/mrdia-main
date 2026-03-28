const Reply = require("../../structures/handlers/replyHandler");
const { listQueues } = require("../normal/music/listqueues");

module.exports = {
	name: "next_page_listqueues",
	returnErrors: false,
	run: async (client, message) => {
		const footer = message.message?.embeds?.[0]?.footer?.text;
		if (!footer) return Reply.send(message, { content: "Unable to determine current page.", ephemeral: true });

		const pageData = footer.match(/Page\s+(\d+)\/(\d+)/i);
		if (!pageData) return Reply.send(message, { content: "Unable to determine current page.", ephemeral: true });

		const currentPage = parseInt(pageData[1], 10);
		const maxPage = parseInt(pageData[2], 10);
		const nextPage = Math.min(currentPage + 1, maxPage);
		const title = message.message?.embeds?.[0]?.title ?? "";
		const isLegacy = title.includes("Legacy");

		await Reply.deferUpdate(message);
		await listQueues(message, client, nextPage, isLegacy);
	},
};
