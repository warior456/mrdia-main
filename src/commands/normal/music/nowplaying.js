const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
module.exports = {
	name: "nowplaying", //extras: commandOptions
	aliases: ["np"],
	description: "Shows the currently playing song",
	category: "music",
	run: async (client, message, args) => {
		const queue = client.distube.getQueue(message);
		if (!queue) return Reply.send(message, `There is nothing playing right now!`);
		await Reply.deferReply(message, false); //only use if command can take long
		Reply.editReply(message, { embeds: nowPlaying(client, queue), components: addButtons() });
	},
};

function nowPlaying(client, queue) {
	const song = queue.songs[0];
	nowPlayingEmbed = new EmbedBuilder()
		.setColor(client.config.musicCommandColor)
		.setTitle(`Now Playing:`)
		.setDescription(`**[${song.name}](${song.url})**`)
		.addFields({
			name: `Duration: ${queue.formattedCurrentTime}/${song.formattedDuration}`,
			value: `Author: [${song.uploader.name}](${song.uploader.url})\nRequested by: ${song.user})`,
		})
	    .setFooter({ text: `Repeat: ${loopMode(queue)}` });
	return [nowPlayingEmbed];
}

function loopMode(queue) {
    let textloopmode = ''
    switch (queue.repeatMode) {
        case 0:
            textloopmode = 'Disabled'
            break;
        case 1:
            textloopmode = 'Song'
            break;
        case 2:
            textloopmode = 'Queue'
            break;
    }
    return textloopmode
}

function addButtons() {
	const row = new ActionRowBuilder().addComponents(
		new ButtonBuilder().setCustomId("refresh").setLabel("Refresh").setStyle(ButtonStyle.Primary), //blue
		new ButtonBuilder().setCustomId("senddm").setLabel("Send in dm").setStyle(ButtonStyle.Success), //gray
		new ButtonBuilder().setCustomId("savefavorite").setLabel("Add to favorites").setStyle(ButtonStyle.Success), // green
		new ButtonBuilder().setCustomId("end").setLabel("End interaction").setStyle(ButtonStyle.Danger) //red
	);

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("previous").setLabel("Previous").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("pauseresume").setLabel("Pause/Resume song").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("skip").setLabel("Skip").setStyle(ButtonStyle.Primary)
    )
	return [row, row2];
}
