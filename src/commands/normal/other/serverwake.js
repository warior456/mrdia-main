const Reply = require("../../../structures/handlers/replyHandler");
const fetch = require("node-fetch");

module.exports = {
	name: "wake", //extras: commandOptions
	aliases: [],
	description: "Wakes the Minecraft server",
	category: "other",
	noHelp: true,
	run: (client, message, args) => {
		if ((message.channel.id != "998168141911822376")&&(message.channel.id != "1273971416966103124")&&(message.channel.id != "1336666205037137993")) {
			return Reply.send(message, "Wrong channel!, this is a private command and can only be used in the #serverwake channel in some servers");
		}
		Reply.send(message, "Waking server...")
		fetch(client.config.serverwakeapilink)
	}
}
