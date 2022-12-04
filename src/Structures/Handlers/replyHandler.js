"use strict";


//type of message: message.type === 'APPLICATION_COMMAND' can be defered .followed and .replied
//                 message.type === 'MESSAGE_COMPONENT'   can be defered .followed and .replied
//                 message.type === 'DEFAULT'             can only be message.channel.send

// editReply should be used when you deferred a reply
// followup should only be used if a message has been send before


/**
     * @abstract
     */
class Reply {
    constructor() {
        throw new Error("You can't initiate a utility class !!!");
    }
    /**
     * @param {object} message the message or interaction component
     * @param {object} content - the reply content
     * @returns {Promise<void>}
     */
    static send(message, content) {
        try {
            if (message.type === 'APPLICATION_COMMAND' || message.type === 'MESSAGE_COMPONENT') {
                message.reply(content);
            } else {
                message.channel.send(content);
            }
        } catch (error) {
            console.log(error)
        }
    }
    

    static async deferReply(message, invisible) {
        if (message.type === 'APPLICATION_COMMAND' || message.type === 'MESSAGE_COMPONENT') {
            await message.deferReply({ephemeral: invisible})
        } else {
            return
        }
    }

    static async deferUpdate(message) {
        if (message.type === 'MESSAGE_COMPONENT') {
            await message.deferUpdate({ephemeral: invisible})
        } else {
            return
        }
    }

    static editReply(message, content) { //used in lyrics.js play.js playlist.js , should be used for editing a reply sent by the bot or when sending a message after defer
        try {
            if (message.type === 'APPLICATION_COMMAND' || message.type === 'MESSAGE_COMPONENT') { //removed && message.options don't know what it did
                message.editReply(content);
            } else
                message.channel.send(content);
        }
        catch (error) {
            console.log(error)
        }
    }

    static follow(message, content) { //sends a message , should use editReply when possible
        try {
            if (message.type === 'APPLICATION_COMMAND' || message.type === 'MESSAGE_COMPONENT') {
                message.followUp(content);
            } else {
                message.channel.send(content);
            }
        } catch (error) {
            console.log(error)
        }
    }

    static edit(message, content) { //edits , i should check this further
        try {
            if (message.type === 'APPLICATION_COMMAND' && message.options) {    //messsage.options is a way of checking if there was already a message (i think)
                message.editReply(content);
            } else
                message.edit(content);
        }
        catch (error) {
            console.log(error)
        }
    }

    static dm(message, content) { //dms a user
        try {
            message.member.user.send(content).catch(() => message.followUp({ content: "Couldn't dm you. Are your dm's enabled?", ephemeral: true }));
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Reply;
