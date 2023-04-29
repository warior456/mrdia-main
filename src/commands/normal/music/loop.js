const { RepeatMode } = require("distube");
const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
	name: "loop", //extras: commandOptions
	aliases: ["l", "repeat"],
	options: [
		//optional
		{
			name: "repeatmode",
			type: ApplicationCommandOptionType.String,
			description: "choose the repeatmode",
			required: true,
			choices: [
				{ name: "Disabled", value: "disabled" },
				{ name: "Disable", value: "disable" },
				{ name: "Off", value: "off" },
				{ name: "Song", value: "song" },
				{ name: "Current", value: "current" },
				{ name: "Queue", value: "queue" },
				{ name: "All", value: "all" }
			],
		},
	],
	description: "choose the way to loop songs",
	category: "music",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.send(message, { content: `There is nothing playing right now!`, ephemeral: true });

		args[0] = toNumeric(args[0]);

		queue.setRepeatMode(args[0]);
		Reply.send(message, `Repeat mode is now: "${toString(queue.repeatMode)}"`);
	},
};

function toNumeric(arg) {
	arg.toLowercase();
	switch (arg) {
		case "disabled":
			return RepeatMode.DISABLED;
		case "disable":
			return RepeatMode.DISABLED;
		case "off":
			return RepeatMode.DISABLED;
		case "song":
			return RepeatMode.SONG;
		case "current":
			return RepeatMode.SONG;
		case "queue":
			return RepeatMode.QUEUE;
		case "all":
			return RepeatMode.QUEUE;
		default:
			return undefined;
	}
}

function toString(arg) {
	switch (arg) {
		case RepeatMode.DISABLED:
			return "Disabled";
		case RepeatMode.SONG:
			return "Song";
		case RepeatMode.QUEUE:
			return "Queue";
		default:
			return "error";
	}
}
