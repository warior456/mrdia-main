const Reply = require("../../structures/handlers/replyHandler");
const { listFavorites } = require("../normal/music/favorites");

module.exports = {
	name: "previous_page_favorites",
	returnErrors: false,
	run: async (client, message) => {
		const footer = message.message?.embeds?.[0]?.footer?.text;
		if (!footer) return Reply.send(message, { content: "Unable to determine current page.", ephemeral: true });

		const pageData = footer.match(/Page\s+(\d+)\/(\d+)/i);
		if (!pageData) return Reply.send(message, { content: "Unable to determine current page.", ephemeral: true });

		const currentPage = parseInt(pageData[1], 10);
		const previousPage = Math.max(currentPage - 1, 1);

		const userMatch = footer.match(/ID:\s*(\d+)/i) || footer.match(/(\d{17,20})/);
		const requestedUserId = userMatch ? userMatch[1] : undefined;

		await Reply.deferUpdate(message);
		await listFavorites(message, client, previousPage, requestedUserId);
	},
};
