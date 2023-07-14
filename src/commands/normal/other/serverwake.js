const Reply = require("../../../structures/handlers/replyHandler");
const wol = require('wake_on_lan');

module.exports = {
	name: "wake", //extras: commandOptions
	aliases: [],
	description: "Wakes the Minecraft server",
	category: "other",
	noHelp: true,
	run: (client, message, args) => {
		if (message.channel.id != "998168141911822376") {
			return Reply.send(message, "Wrong channel! (go to: Not a Discord Community But Rather a Discord Server #serverwake)");
		}
		var i = document.createElement("img");
		i.src = client.config.serverwakeapilink;
		Reply.send(message, "Waking server...")
	},
};
