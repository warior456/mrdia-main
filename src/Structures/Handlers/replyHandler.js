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
            // const content = isEmbed ? { embeds: [reply] } : reply;    // better name possible
            if (message.type === 'APPLICATION_COMMAND') {    // a ternary IF statement (like on the previous line is also possible, but imo less clean)
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
            // const content = isEmbed ? { embeds: [reply] } : reply;    // better name possible
            if (message.type === 'APPLICATION_COMMAND') {    // a ternary IF statement (like on the previous line is also possible, but imo less clean)
                message.editReply(content);
            } else {
                message.channel.edit(content);
            }
        } catch (error) {
            console.log(error)
        }
    }

    static defer(message){
        if (message.type === 'APPLICATION_COMMAND') {    // a ternary IF statement (like on the previous line is also possible, but imo less clean)
            message.deferReply()
        } else {
            return
        }
    }
}

module.exports = Reply;
