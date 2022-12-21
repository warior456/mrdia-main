const { EmbedBuilder } = require('discord.js');


function nowPlaying(client, queue) {
	const song = queue.songs[0];
	nowPlayingEmbed = new EmbedBuilder()
		.setColor(client.config.musicCommandColor)
		.setTitle(`Now Playing:`)
		.setThumbnail(song.thumbnail)
		.setDescription(`**[${song.name}](${song.url})**\n`)
		.addFields(
			{ name: `Author:`, value: `[${song.uploader.name}](${song.uploader.url})`, inline: true },
			{ name: `Duration:`, value: `${queue.formattedCurrentTime}/${song.formattedDuration}`, inline: true },
			{ name: `\u200B`, value: `\u200B`, inline: true }
		)
		.addFields(
			{ name: `Requested by:`, value: `${song.user}`, inline: true },
			{ name: `Repeat:`, value: `${loopMode(queue)}`, inline: true },
			{ name: `Filters:`, value: `[${queue.filters.names.join(', ') || 'Off'}]`, inline: true }
		)
		.setTimestamp();
	return [nowPlayingEmbed];
}

function loopMode(queue) {
	let textloopmode = "";
	switch (queue.repeatMode) {
		case 0:
			textloopmode = "Disabled";
			break;
		case 1:
			textloopmode = "Song";
			break;
		case 2:
			textloopmode = "Queue";
			break;
	}
	return textloopmode;
}

module.exports={
    nowPlaying
}