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

				const stack = typeof error.stack === "string" ? error.stack : "";
				const message = typeof error.message === "string" ? error.message : "";
				const isYtDlpSolverNoise =
					stack.includes("@distube/ytdl-core") &&
					(stack.includes("ejs-solvers.js") || message.includes("reading 'GG'"));

				if (isYtDlpSolverNoise) return;
				console.error(error);
			})
	},
};
