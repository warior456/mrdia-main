"use strict";

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
            if (message.type === 'APPLICATION_COMMAND'|| message.message.type === 'APPLICATION_COMMAND') {
                message.reply(content);
            } else {
                message.channel.send(content);
            }
        } catch (error) {
            console.log(error)
        }
    }

    static edit(message, content) {
        try {

            if (message.type === 'APPLICATION_COMMAND' && message.options) {
                message.editReply(content);
            } else
                message.edit(content);
        }
        catch (error) {
            console.log(error)
        }
    }

    static defer(message) { //fix
        message.deferReply()
        // if (message.type === 'APPLICATION_COMMAND'|| message.message.type === 'APPLICATION_COMMAND') {// fix some potential problems with using this
        //     message.deferReply()
        // } else {
        //     return
        // }
    }

    static deferEdit(message, content) {
        try {

            if (message.type === 'APPLICATION_COMMAND' && message.options) {
                message.editReply(content);
            } else
                message.channel.send(content);
        }
        catch (error) {
            console.log(error)
        }
    }

    static replySend(message, content) { //todo remove this
        try {
            message.reply(content)
        } catch (error) {
            console.log(error)
        }
    }
    static follow(message, content) {
        try {
            if (message.type === 'APPLICATION_COMMAND' || message.message.type === 'APPLICATION_COMMAND') {
                message.followUp(content);
            } else {
                message.channel.send(content);
            }
        } catch (error) {
            console.log(error)
        }
    }

    static dm(message, content) {
        try {
            message.member.user.send(content).catch(() => message.followUp({ content: "Couldn't dm you. Are your dm's enabled?", ephemeral: true }));
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Reply;
