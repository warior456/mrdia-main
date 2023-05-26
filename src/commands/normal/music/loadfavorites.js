const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType } = require("discord.js");
const { loadFavorites } = require("../../../functions/music/loadFavoritesFunction");
module.exports = {
	name: "loadfavorites", //extras: commandOptions
	aliases: ["loadfavs"],
	description: "load all your favorites",
	category: "music",
	run: async (client, message, args) => {
		//async only if deferring
        requesteduserid = args[0]
        if(!requesteduserid)requesteduserid = message.member.user.id

        const voiceChannel = message.member?.voice?.channel;
		if (!voiceChannel) return Reply.send(message, { content: "You must join a voice channel first.", ephemeral: true });
		Reply.send(message, `loading favorites of <@${requesteduserid}> ...`)


        
		content = await loadFavorites(client, message, requesteduserid, voiceChannel);
        Reply.editReply(message, content)
	},
};


