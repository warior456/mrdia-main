const Reply = require("../../../structures/handlers/replyHandler");
const Guild = require("../../../schemas/guild");
const mongoose = require("mongoose");

module.exports = {
	name: "guilddatabase",
	aliases: [],
	description: "View or initialize guild profile in database",
	category: "other",
	run: async (client, message, args) => {
		try {
			let guildProfile = await Guild.findOne({ guildId: message.guild.id });

			if (!guildProfile) {
				// Create new guild profile
				guildProfile = await new Guild({
					_id: new mongoose.Types.ObjectId(),
					guildId: message.guild.id,
					guildName: message.guild.name,
					guildIcon: message.guild.iconURL() || "None",
				});

				await guildProfile.save().catch(console.error);

				Reply.send(message, {
					content: `Guild profile created:\nServer Name: ${guildProfile.guildName}\nServer Id: ${guildProfile.guildId}`,
					ephemeral: true,
				});
			} else {
				// Guild profile already exists
				Reply.send(message, {
					content: `Guild profile found:\nServer Name: ${guildProfile.guildName}\nServer Id: ${guildProfile.guildId}`,
					ephemeral: true,
				});
			}
		} catch (error) {
			console.error(error);
			Reply.send(message, {
				content: "An error occurred while accessing the database",
				ephemeral: true,
			});
		}
	},
};
