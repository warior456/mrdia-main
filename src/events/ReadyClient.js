const chalk = require("chalk")
const Box = require("cli-box")
const config = require("../../Config");

module.exports = {
    
    name: "ready",
    once: true,
    run: async (client) => {
        client.user.setActivity("Starting...", {
            type: `PLAYING`,
        })
        const ClientBox = new Box({
            w: Math.floor(client.user.tag.length + 27),
            h: 7,
            stringify: false,
            marks: {
                nw: '╭',
                n: '─',
                ne: '╮',
                e: '│',
                se: '╯',
                s: '─',
                sw: '╰',
                w: '│'
            },
            hAlign: 'left',
        }, `C L I E N T   I N F O R M A T I O N

Client Details    ::    ${client.user.tag}
Guilds Count      ::    ${client.guilds.cache.size}
User Count        ::    ${client.users.cache.size}
NodeJS Version    ::    ${process.version}
`).stringify()

        const CommandsBox = new Box({
            w: Math.floor(`Initiating ${client.commands.messageCommands.aliases.size} messageCommands Aliases.`.length + 37),
            h: 8,
            stringify: false,
            marks: {
                nw: '╭',
                n: '─',
                ne: '╮',
                e: '│',
                se: '╯',
                s: '─',
                sw: '╰',
                w: '│'
            },
            hAlign: "left",
        }, `C O M M A N D S   I N F O R M A T I O N

MessageCommands            ::    Initiating ${client.commands.messageCommands.size} messageCommands.
MessageCommands Aliases    ::    Initiating ${client.commands.messageCommands.aliases.size} messageCommands Aliases.
SlashCommands              ::    Initiating ${client.commands.slashCommands.size} slashCommands.
SelectMenus                ::    Initiating ${client.commands.selectMenus.size} selectMenus.
ContextMenus               ::    Initiating ${client.commands.contextMenus.size} contextMenus.
ButtonCommands             ::    Initiating ${client.commands.buttonCommands.size} buttonCommands.
Client Events              ::    Initiating ${client.events.size} events.
`).stringify()

        console.log(chalk.bold.greenBright(ClientBox))
        console.log(chalk.bold.blueBright(CommandsBox))
        console.log(`${client.user.tag} is Online`);

        const activities = [`${config.prefix}help`, `${config.prefix}help`];
        const updateDelay = 20; // in seconds
        let currentIndex = 0;

        setInterval(() => {
            const activity = activities[currentIndex];
            client.user.setActivity(activity);

            // update currentIndex
            // if it's the last one, get back to 0
            currentIndex = currentIndex >= activities.length - 1
                ? 0
                : currentIndex + 1;
        }, updateDelay * 1000);
    }

}

// module.exports = (message, client) =>{
    
//     client.user.setActivity(`starting`, { type: 'PLAYING' });
//     console.log(`Logged to the client ${client.user.username}\n-> Ready on ${client.guilds.cache.size} servers for a total of ${client.users.cache.size} users`);
//     console.log('Mrdia is Online');

//     const activities = [`${process.env.PREFIX}help`, `${process.env.PREFIX}help`];


//     const updateDelay = 20; // in seconds
//     let currentIndex = 0;

//     setInterval(() => {
//         const activity = activities[currentIndex];
//         client.user.setActivity(activity);

//         // update currentIndex
//         // if it's the last one, get back to 0
//     currentIndex = currentIndex >= activities.length - 1 
//             ? 0
//             : currentIndex + 1;
//   }, updateDelay * 1000);

//     // console.log(client.guilds.cache.id[0])
//     // client.guild[0].createInvite({ unique: false, temporary: false }).then(invite => {
//     //     console.log(message.guild.id)
//     //     console.log(invite.code);
//     // })
// }