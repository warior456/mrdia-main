const discord = require('discord.js');
Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
	name: "ping2",
	aliases: [],
	description: "Run this to see my ping.",
	category: `other`,
	run: async (message, client, Discord, args, cmd) => {
		const ping = new discord.MessageEmbed()
			.setColor('RANDOM')
			.setTimestamp()
			.setTitle('🏓╎ Pong!')
			.setDescription(`🏠╎Websocket Latency: ${client.ws.ping}ms\n🤖╎Bot Latency: ${ Date.now() - message.createdTimestamp}ms`);
		Reply.send(message, ping, true)
	}

}

// const { MessageEmbed, Message } = require("discord.js");

// module.exports = {
// 	name: "ping2",
// 	aliases: [],
// 	description: "Run this to see my ping.",
// 	run: async(message, client, container) => {
// 		const ping = new MessageEmbed()
// 		.setColor('RANDOM')
// 		.setTimestamp()
// 		.setTitle('🏓╎ Pong!')
// 		.setDescription(`🏠╎Websocket Latency: ${client.ws.ping}ms\n🤖╎Bot Latency: ${message.createdTimestamp - Date.now()-1000}ms`);
// 		message.channel.send({ embeds: [ping]});
// 		//interaction.reply({ embeds: [ping] }) || message.channel.send({ embeds: [ping]});
// 	}
// }