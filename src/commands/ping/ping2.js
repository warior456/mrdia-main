const { MessageEmbed, Message } = require("discord.js");

module.exports = {
	name: "ping2",
	aliases: [],
	description: "Run this to see my ping.",
	run: async(message, client, container) => {
		const ping = new MessageEmbed()
		.setColor('RANDOM')
		.setTimestamp()
		.setTitle('🏓╎ Pong!')
		.setDescription(`🏠╎Websocket Latency: ${client.ws.ping}ms\n🤖╎Bot Latency: ${message.createdTimestamp - Date.now()-1000}ms`);
		message.channel.send({ embeds: [ping]});
		//interaction.reply({ embeds: [ping] }) || message.channel.send({ embeds: [ping]});
	}
}