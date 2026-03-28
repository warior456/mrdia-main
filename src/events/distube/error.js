const Reply = require("../../structures/handlers/replyHandler");
module.exports = {
	name: "error",
	isCustom: true,
	run: async (client) => {
		client.distube

			.on("error", (arg1, arg2) => {
				// DisTube versions differ in error event argument order.
				// Normalize and only log the actual Error object.
				const error = arg1 instanceof Error ? arg1 : arg2 instanceof Error ? arg2 : null;
				if (!error) return;
				console.error(error);
			})
	},
};
