const Reply = require("../../structures/handlers/replyHandler");
const { previousSong } = require("../../functions/music/previousFunction");

module.exports = {
	name: "previous",
	returnErrors: false, //commandOptions
	//ownerOnly: true,
	run: async (client, message) => {
		await Reply.deferUpdate(message); //Reply.follow to send messages and Reply.editReply to edit current message
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.follow(message, { content: "There is nothing in the queue right now!", ephemeral: true });
		content = await previousSong(message.member.user.id, queue);
        Reply.follow(message, content)
	},
};
