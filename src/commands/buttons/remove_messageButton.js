const Reply = require("../../structures/handlers/replyHandler")
const { MessageFlags } = require("discord.js");

module.exports = {
    name : 'remove_message',
    returnErrors: false, //commandOptions
    //ownerOnly: true,
    run : async(client, message) => {
        await Reply.deferUpdate(message) //Reply.follow to send messages and Reply.editReply to edit current message
        if(message.message.type == 20){//check for efemeral message
            Reply.follow(message, { content: `The message you want to delete is Ephemeral please press "Dismiss message"\n If you believe this is not the case please contact the bot owner`, flags: MessageFlags.Ephemeral })
            return
        } 

        message.message.delete()
        //console.log(message.message.type)
    }
}