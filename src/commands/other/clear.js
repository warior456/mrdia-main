const config = require('../../../Config');
const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'clear',
    aliases: [],
    description: 'clear messages!',
    options: [{
        name: "amount",
        type: "INTEGER",
        description: "Give the amount of messages to clear (max 100)",
        required: true
    }],
    category: 'other',
    run: async (message, client, Discord, args, cmd) => {

        if (message.member.permissions.has("MANAGE_MESSAGES") || message.member.user.id === config.owner) {                             //if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true))

            if (!args[0]) return Reply.send(message, { content: `usage: ${process.env.PREFIX}clear [amount 1-100]`, ephemeral: true });
            if (isNaN(args[0])) return Reply.send(message, { content: "That is not a number!", ephemeral: true });
            if (args[0] > 100) return Reply.send(message, { content: "you can't delete more than 100 messages", ephemeral: true });
            if (args[0] < 1) return Reply.send(message, { content: "You must delete at least 1 message", ephemeral: true });

            await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
                message.channel.bulkDelete(messages);
                Reply.send(message, { content: `Removed ${args[0]} messages!`, ephemeral: true })
            })
        }
        else {
            Reply.send(message, { content: "I don't think this is for you!", ephemeral: true })
        }
    }
}