const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { PermissionsBitField } = require('discord.js');

module.exports = {
	name: "ping",
	aliases: [],
	description: "pong!",
	category: "other",
	run: (client, message, args) => {
		let pongMessage = "";
		message.channel.send("Loading data...").then(async (msg) => {
			msg.delete();
			pongMessage += `pong! : Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`;
			//console.log(message.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles))
			//console.log(message..permissions.has(PermissionsBitField.Flags.Administrator));
			
			Reply.send(message, { content: pongMessage, components: addButtons() });
		});
	},
};

function addButtons() {
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("pong").setLabel("Pong").setStyle(ButtonStyle.Success).setDisabled(true),
	)
	return [row]
}
