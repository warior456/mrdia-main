"use strict";

const { MessageType, InteractionType } = require("discord.js");

//type of message: message.type === 'APPLICATION_COMMAND' can be defered .followed and .replied
//                 message.type === 'MESSAGE_COMPONENT'   can be defered .followed and .replied
//                 message.type === 'DEFAULT'             can only be message.channel.send

// editReply should be used when you deferred a reply
// followup should only be used if a message has been send before

//DEFAULT = 0 = MessageType.Default
//APPLICATION_COMMAND = 2 = InteractionType.ApplicationCommand
//MESSAGE_COMPONENT = 3 = InteractionType.MessageComponent
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
			if (message.type === InteractionType.ApplicationCommand || message.type === InteractionType.MessageComponent) {
				message.reply(content);
			} else {
				message.channel.send(content);
			}
		} catch (error) {
			console.log(error);
		}
	}

	static async deferReply(message, invisible) {
		if (message.type === InteractionType.ApplicationCommand || message.type === InteractionType.MessageComponent) {
			await message.deferReply({ ephemeral: invisible });
		} else {
			return;
		}
	}

	static async deferUpdate(message) {
		if (message.type === InteractionType.MessageComponent) {
			await message.deferUpdate();
		} else {
			return;
		}
	}

	static editReply(message, content) { 
		//edits a deferred message or sends a message if it's a messageCommand
		try {
			if (message.type === InteractionType.ApplicationCommand || message.type === InteractionType.MessageComponent) {
				//removed && message.options don't know what it did
				message.editReply(content);
			} else message.channel.send(content);
		} catch (error) {
			console.log(error);
		}
	}

	static follow(message, content) {
		//sends a message after a deferred message (must first use editReply after deferReply)
		try {
			if (message.type === InteractionType.ApplicationCommand || message.type === InteractionType.MessageComponent) {
				message.followUp(content);
			} else {
				message.channel.send(content);
			}
		} catch (error) {
			console.log(error);
		}
	}

	static edit(message, content) {
		//edits , i should check this further
		try {
			if (message.type === InteractionType.ApplicationCommand && message.options) {
				//messsage.options is a way of checking if there was already a message (i think)
				message.editReply(content);
			} else message.edit(content);
		} catch (error) {
			console.log(error);
		}
	}

	static dm(message, content) {
		//dms a user
		try {
			message.member.user.send(content).catch(() => message.followUp({ content: "Couldn't dm you. Are your dm's enabled?", ephemeral: true }));
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = Reply;
