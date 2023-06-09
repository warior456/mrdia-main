const Reply = require("../../../structures/handlers/replyHandler");
const { ApplicationCommandOptionType , EmbedBuilder} = require("discord.js");

module.exports = {
	name: "lyrics", //extras: commandOptions
	aliases: [],
	options: [//optional
		{
			name: "name",
			type: ApplicationCommandOptionType.String ,
			description: "Give the song name",
			required: false,
		},
	],
	description: "Gives the lyrics to a song",
	category: "music",
	run: async (client, message, args) => {
		await Reply.deferReply(message, false)
        //return Reply.send('This feature is currently WIP')
        // if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send(message, 'Join a voice channel first!')
        if (!args[0]) {
			const queue = client.distube.getQueue(message);
            if (queue) {
                args = [queue.songs[0].name]
            } else return Reply.editReply(message, `There is no song playing please provide a song to search for`)
        }
        const searches = await LyricsClient.songs.search(args.join(' '));

        //Pick first one
        const firstSong = searches[0];
        if (!firstSong) {
            return Reply.editReply(message, `Couldn't find any lyrics matching your search`)
        }
        const lyrics = await firstSong.lyrics();
        const embed = new EmbedBuilder()
            .setColor('#FFFF00')
            .setTitle(`**Lyrics of the Song:**`)
            .setDescription(lyrics)

        Reply.editReply(message, { embeds: [embed] })
	},
};


