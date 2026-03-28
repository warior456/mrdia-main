const Reply = require("../../../structures/handlers/replyHandler");
const { PermissionFlagsBits } = require("discord.js");

module.exports = {
	name: "ginvite",
	aliases: ["getinvite"],
	description: "Get invite links for all servers the bot is in (Owner only)",
	category: "owner",
	ownerOnly: true,
	ignoreSlash: true,
	run: async (client, message, args) => {
		try {
			const guilds = client.guilds.cache;
			let inviteList = "**Invite links for all guilds:**\n========================================\n";
			let count = 0;

			for (const [guildId, guild] of guilds) {
				try {
					const me = guild.members.me ?? (await guild.members.fetchMe().catch(() => null));
					if (!me) {
						inviteList += `${++count}. **${guild.name}** - (Bot member unavailable in cache)\n`;
						continue;
					}

					// Find a channel where bot can create invites
					const inviteChannel = guild.channels.cache.find((ch) => {
						if (typeof ch.createInvite !== "function") return false;
						const permissions = ch.permissionsFor(me);
						return Boolean(permissions?.has(PermissionFlagsBits.CreateInstantInvite));
					});

					if (inviteChannel) {
						const invite = await inviteChannel.createInvite({
							maxAge: 0, // Never expires
							maxUses: 0, // Unlimited uses
						});
						inviteList += `${++count}. **${guild.name}** - https://discord.gg/${invite.code}\n`;
					} else {
						inviteList += `${++count}. **${guild.name}** - (No accessible channels)\n`;
					}
				} catch (error) {
					console.error(`Error creating invite for ${guild.name}:`, error);
					inviteList += `${++count}. **${guild.name}** - (Error creating invite)\n`;
				}
			}

			// Send in chunks if too long
			if (inviteList.length > 2000) {
				const chunks = inviteList.match(/[\s\S]{1,1900}/g) || [];
				for (const chunk of chunks) {
					Reply.send(message, chunk);
				}
			} else {
				Reply.send(message, inviteList);
			}
		} catch (error) {
			console.error(error);
			Reply.send(message, {
				content: "An error occurred while generating invite links",
				ephemeral: true,
			});
		}
	},
};
