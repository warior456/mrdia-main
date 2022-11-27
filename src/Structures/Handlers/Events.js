const fs = require("fs");
const Filer = require("../../Utils/Filer");
const Discord = require("discord.js");
const { path, config } = require("../../../main")
const { connection } = require('mongoose')
// module.exports = async function (client) {
//     const container = {
//         RootPath: path,
//         Config: config,
//         Discord: Discord
//     };
//     Filer(`${container.RootPath}/src/events`, async function (err, res) {
//         res.forEach(file => {
//             if (fs.statSync(file).isDirectory()) return;
//             const event = require(file);
//             if (event.ignoreFile) return;
//             if (event.customEvent) event.run(client, container);
//             client.events.set(event.name, event);

//             if (event.once) client.once(event.name, (...args) => event.run(...args, client, container));
//             else client.on(event.name, (...args) => event.run(...args, client, container));
//         })
//     })
// }

module.exports = async function (client) {
    const eventFolders = fs.readdirSync('./src/events')
    for (const folder of eventFolders) {
        const eventFiles = fs
            .readdirSync(`./src/events/${folder}`)
            .filter((file) => file.endsWith(".js"));
        switch (folder) {
            case "client":
                for (const file of eventFiles) {
                    const event = require(`../../events/${folder}/${file}`)
                    if (event.ignoreFile) return;
                    if (event.once) client.once(event.name, (...args) => event.run(...args, client));
                    else client.on(event.name, (...args) => event.run(...args, client));
                }
                break;
            case "mongo":
                for (const file of eventFiles) {
                    const event = require(`../../events/${folder}/${file}`)
                    if (event.once) {
                        connection.once(event.name, (...args) =>
                            event.execute(...args, client))
                    } else {
                        connection.on(event.name, (...args) =>
                            event.execute(...args, client))
                    }
                }
                break;
            default:
                break;
        }
    }


}