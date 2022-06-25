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
    static async send(message, reply, isEmbed) {
        try {
            switch (isEmbed) {
                case true:
                    if(message.type == 'APPLICATION_COMMAND')return message.reply({ embeds: [reply] })
                    message.channel.send({ embeds: [reply] })
                    break;

                default:
                    if(message.type == 'APPLICATION_COMMAND')return message.reply(reply)
                    message.channel.send(reply)
                    break;
            }
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = Reply;
