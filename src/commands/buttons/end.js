const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: "end",
    isButton: true,
    run: async (message, client, container) => {
        await Reply.deferUpdate(message)
        let row = message.message.components[0]
        let Embed = message.message.embeds[0]
        for (let i = 0; i < row.components.length; i++) {
            row.components[i].setDisabled(true);
        }
        content = { embeds: [Embed], components: [row] }
        Reply.edit(message.message, content);
    }
}