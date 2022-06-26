"use strict";


class Reply {
    /**
     * @throws {Error} - This is a utility class
     */
    constructor() {
        throw new Error("You can't initiate a utility class !!!");
    }
    /**
     * 
     * @param {object}  message the message or interaction component
     * @param {object} reply - the reply content
     * @param {boolean} isEmbed - declares if it is an embed
     * @returns {Promise<void>}
     */
    static send(message, reply, isEmbed) {
        try {
            const content = isEmbed ? { embeds: [reply] } : reply;    // better name possible
            if (message.type === 'APPLICATION_COMMAND') {    // a ternary IF statement (like on the previous line is also possible, but imo less clean)
                message.reply(content);
            } else {
                message.channel.send(content);
            }
        } catch (error) {
            console.log(error)
        }
    }

    static edit(message, reply, isEmbed) {
        try {
            const content = isEmbed ? { embeds: [reply] } : reply;    // better name possible
            if (message.type === 'APPLICATION_COMMAND') {    // a ternary IF statement (like on the previous line is also possible, but imo less clean)
                message.edit(content);
            } else {
                message.channel.edit(content);
            }
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = Reply;
