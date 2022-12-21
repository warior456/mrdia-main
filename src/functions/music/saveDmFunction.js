const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

function saveDm(client, queue, message) {
	const song = queue.songs[0];
	saveDmEmbed = new EmbedBuilder()
		.setColor(client.config.musicCommandColor)
		.setTitle(`Now Playing:`)
		.setThumbnail(song.thumbnail)
		.setDescription(`**[${song.name}](${song.url})**\n`)
		.addFields(
			{ name: `Author:`, value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
			{ name: `Length:`, value: `${song.formattedDuration}`, inline: true },
			{ name: `\u200B`, value: `\u200B`, inline: true }
		)
        .setFooter({text: `Saved from ${message.guild.name}`})
		.setTimestamp();
	return [saveDmEmbed];
}

function saveDmButton(){
    	//always at the bottom of a file
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("remove_message").setLabel("Delete").setStyle(ButtonStyle.Danger) //red
	);
	//can have up to 5 rows
	return [row];
}

module.exports = {
    saveDm,
    saveDmButton
};
