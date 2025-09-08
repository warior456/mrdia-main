const { seekMessage, seekTo } = require("../../../functions/music/seekFunction");
const { isNatural } = require("../../../functions/utilities");
const Reply = require("../../../structures/handlers/replyHandler");
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, ApplicationCommandOptionType, MessageFlags } = require("discord.js");
module.exports = {
    name: "seek", //extras: commandOptions
    aliases: [],
    options: [
        {
            name: "timestamp",
            type: ApplicationCommandOptionType.Integer,
            description: "(in seconds) leave empty for seek menu",
            required: false,
        }
    ],
    description: "seek to a specific point in the song (or gives a menu when you don't provide a time)",
    category: "music",
    run: async (client, message, args) => {
        const queue = client.distube.getQueue(message);
        if (!queue) return Reply.send(message, { content: `There is nothing playing right now!`, flags: MessageFlags.Ephemeral });

        if (!args[0]) {
            seekEmbed = seekMessage(client, queue)
            Reply.send(message, { embeds: seekEmbed, components: addButtons(), flags: MessageFlags.Ephemeral });
        } else if (!isNatural(Number(args[0]))) {
            console.log("notnatural")
            seekEmbed = seekMessage(client, queue)
            Reply.send(message, { content: "Invalid input", ephemeral: true })
            Reply.follow(message, { embeds: seekEmbed, components: addButtons(), flags: MessageFlags.Ephemeral });
        } else {
            Reply.send(message, seekTo(queue, Number(args[0])))
        }

    }
};

function addButtons() {
    //always at the bottom of a file
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("rewind_30_sec").setLabel("Rewind 30s").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("rewind_10_sec").setLabel("Rewind 10s").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("forward_10_sec").setLabel("Forward 10s").setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId("forward_30_sec").setLabel("Forward 30s").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId("remove_message").setLabel("Delete message").setStyle(ButtonStyle.Danger)
    );

    //can have up to 5 rows
    return [row];
}

