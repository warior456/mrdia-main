const Reply = require("../../structures/handlers/replyHandler")

module.exports = {
    name : 'refresh',
    returnErrors: false, //commandOptions
    ownerOnly: true,
    run : async(client, interaction) => {
        await Reply.deferUpdate(message) //Reply.follow to send messages and Reply.editReply to edit current message
        
    }
}