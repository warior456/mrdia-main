const Reply = require("../../structures/handlers/replyHandler")

module.exports = {
    name : 'remove_message',
    returnErrors: false, //commandOptions
    //ownerOnly: true,
    run : async(client, message) => {
        await Reply.deferUpdate(message) //Reply.follow to send messages and Reply.editReply to edit current message
        message.message.delete()
    }
}