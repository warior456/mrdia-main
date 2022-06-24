module.exports = {
    name: 'clear',
    aliases: [],
    description: 'clear messages!',

    run: async (message, client, Discord, args, cmd) => {

        if (message.member.permissions.has("MANAGE_MESSAGES") || message.author.id === process.env.OWNER) {                             //if (message.channel.permissionsFor(message.member).has("MANAGE_MESSAGES", true))

            if (!args[0]) return message.reply(`usage: ${process.env.PREFIX}clear [amount 1-100]`);
            if (isNaN(args[0])) return message.reply("That is not a number!");
            if (args[0] > 100) return message.reply("you can't delete more than 100 messages");
            if (args[0] < 1) return message.reply("You must delete at least 1 message");

            await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
                message.channel.bulkDelete(messages);
            })
        }

        else {
            (message.reply("I don't think this is for you!"))
        }
    }
}