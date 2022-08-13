const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: "end",
    isButton: true,
    run: async (message, client, container) => {
        message.deferUpdate()
        let row = message.message.components[0]
        let queEmbed = message.message.embeds[0]
        for (let i = 0; i < row.components.length; i++) {
            row.components[i].setDisabled(true);
        }
        content = { embeds: [queEmbed], components: [row] }
        Reply.edit(message.message, content);
    }
}