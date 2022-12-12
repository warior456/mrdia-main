const Reply = require("../../structures/handlers/replyHandler");
const { ButtonBuilder } = require("discord.js");

module.exports = {
	name: "end",
	returnErrors: false, //commandOptions
	run: async (client, message) => {
		await Reply.deferUpdate(message); //Reply.follow to send messages and Reply.editReply to edit current message
		await disableRows(message);
		content = { embeds: message.message.embeds, components: message.message.components };
		Reply.editReply(message, content);
	},
};

function disableRows(message) {
	message.message.components.forEach((row) => {
		for (let i = 0; i < row.components.length; i++) {
			row.components[i] = ButtonBuilder.from(row.components[i]).setDisabled(true);
		}
	});
}
