const Reply = require("../../structures/handlers/replyHandler")
const { saveDm, saveDmButton } = require("../../functions/music/saveDmFunction");

module.exports = {
    name : 'save_dm',
    returnErrors: false, //commandOptions
    //ownerOnly: true,
    run : async(client, message) => {
        await Reply.deferUpdate(message)
        const queue = client.distube.getQueue(message);
        if (!queue) return Reply.follow(message ,{ content: 'There is nothing playing right now!', ephemeral: true })
        Reply.dm(message, { embeds: saveDm(client, queue, message), components: saveDmButton() })
    }
}


