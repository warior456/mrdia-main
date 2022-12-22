const { EmbedBuilder } = require("discord.js");

function makeQueueEmbed(client, queue, page) {
	description = makeDescription(queue, page);
    footer = makeFooter(page)
	queueEmbed = makeEmbed(client, queue, description, footer);
    return [queueEmbed]
}

module.exports = {
	makeQueueEmbed,
};

function makeDescription(queue, page) {
    let description = ''
    description = `**Current song:** [${queue.songs[0].name}](${queue.songs[0].url})\n\`${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}| Requested by:\` ${queue.songs[0].user} \n==========================================\n`
    for (var i = page.requested * 10 - 9; i < queue.songs.length && i <= page.requested * 10; i++) {
        description += `\`${i}.\` [${queue.songs[i].name}](${queue.songs[i].url})\n\`Duration:\` **${queue.songs[i].formattedDuration}** | \`Requested by:\` ${queue.songs[i].user}\n\n`
    }
    return description
}

function makeFooter(page) {
    return`Page: ${page.requested}/${page.max}`
}

function makeEmbed(client, queue, description, footer) {
	queueEmbed = new EmbedBuilder()
		.setColor(client.config.musicCommandColor)
		.setTitle(`Server queue`)
		.setDescription(description)
		.addFields(
			{ name: `Repeat:`, value: `${loopMode(queue)}`, inline: true },
			{ name: `Filters:`, value: `[${queue.filters.names.join(", ") || "Off"}]`, inline: true },
            {name: `Estimated queue length:`, value: `${queue.formattedDuration}`, inline: true}
		)
        .setFooter({text: footer})
		.setTimestamp();
	return queueEmbed;
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
