const Reply = require("../../structures/handlers/replyHandler");
module.exports = {
	name: "error",
	isCustom: true,
	run: async (client) => {
		client.distube

			.on("error", (channel, e) => {
				
				console.error(e);
			})
	},
};
