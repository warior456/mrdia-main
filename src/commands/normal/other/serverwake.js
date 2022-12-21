const Reply = require("../../../structures/handlers/replyHandler");
const wol = require("wol");

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
		wol.wake("E8:40:F2:3D:FB:93", function (err, res) {
			console.log(err);
		});
		Reply.send(message, "Waking server...");
	},
};
