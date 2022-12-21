const Reply = require("../../structures/handlers/replyHandler");

module.exports = {
	name: "pause_resume",
	returnErrors: false, //commandOptions
	run: async (client, message) => {
		await Reply.deferUpdate(message);
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.follow(message, { content: `There is nothing in the queue right now!`, ephemeral: true });
		content = pauseResume(queue);
		Reply.follow(message, content);
	},
};

function pauseResume(queue) {
	if (queue.paused) {
		queue.resume();
		return "Resumed";
	}
	queue.pause();
	return "Paused";
}
