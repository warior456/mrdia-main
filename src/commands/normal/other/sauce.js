const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "sauce",
    ignore: true,
	aliases: ["saucelink"],
	options: [
		{
			name: "type",
			type: ApplicationCommandOptionType.String,
			description: "sauce",
			required: true,
			choices: [
				{ name: "number", value: "number" },
				{ name: "link", value: "link" },
			],
		},
	],
	description: "sauce",
	category: "other",
	run: async (client, message, args) => {
		const MAX_NUMBER = 639904;//467556;
		const option = args[0];

		if (option === "number") {
			const randomNum = Math.floor(Math.random() * MAX_NUMBER);
			Reply.send(message, { content: `\`${randomNum}\`` });
		} else if (option === "link") {
			if (!message.channel.nsfw) {
				return Reply.send(message, {
					content: "This command can only be used in NSFW channels.",
					ephemeral: true,
				});
			}

			const randomNum = Math.floor(Math.random() * MAX_NUMBER);
			Reply.send(message, { content: `https://nhentai.net/g/${randomNum}/` });
		}
	},
};
