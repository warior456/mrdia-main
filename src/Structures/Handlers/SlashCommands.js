const { readdirSync } = require('fs');
const fs = require("fs");
const Filer = require("../../Utils/Filer");

module.exports = async function (client, path) {
    readdirSync('./src/Commands/').forEach(dirs => {
        try {
            Filer(`${path}/src/Commands/${dirs}`, async function (err, res) {
                res.forEach(file => {
                    if (fs.statSync(file).isDirectory()) return;
                    const cmd = require(file);
                    if (cmd.ignoreFile) return;
                    if (cmd.isButton) return;
                    client.commands.slashCommands.set(require(file).name, require(file))
                })
                let promise = Promise.resolve()
                res.forEach(async function (file) {
                    promise = promise.then(async function () {
                        const interval = 5000;
                        if (fs.statSync(file).isDirectory()) return;
                        const cmd = require(file);
                        if (cmd.ignoreFile) return;

                        if (cmd.guilds && Array.isArray(cmd.guilds)) cmd.guilds.forEach(guildID => {
                            (async () => {
                                const guild = client.guilds.cache.get(guildID) ?? await client.guilds.fetch(guildID)
                                const verifier = guild.commands.cache.find(x => x.name == cmd.name)
                                if (verifier) await guild.commands.edit(verifier.id, {
                                    name: cmd.name,
                                    description: cmd.description ?? "None",
                                    options: cmd.options ?? [],
                                    type: cmd.type ?? "CHAT_INPUT"
                                })
                                else await guild.commands.create({
                                    name: cmd.name,
                                    description: cmd.description ?? "None",
                                    options: cmd.options ?? [],
                                    type: cmd.type ?? "CHAT_INPUT"
                                })
                            })()
                        })
                        else {
                            const verifier = client.application.commands.cache.find(x => x.name == cmd.name)
                            if (verifier) await client.application.commands.edit(verifier.id, {
                                name: cmd.name,
                                description: cmd.description ?? "None.",
                                options: cmd.options ?? [],
                                type: cmd.type ?? "CHAT_INPUT"
                            })
                            else await client.application.commands.create({
                                name: cmd.name,
                                description: cmd.description ?? "None.",
                                options: cmd.options ?? [],
                                type: cmd.type ?? "CHAT_INPUT"
                            })
                        }

                        return new Promise(function (resolve) {
                            setTimeout(resolve, interval);
                        })
                    })
                })
            })

        } catch (error) {
            console.log(error)
        }

    })

}




// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
// const { token } = require('../../../Config');
// const fs = require('node:fs');

// const commands = [];
// const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// // Place your client and guild ids here
// const clientId = '916665664037617705';
// const guildId = '829467609523159080';

// for (const file of commandFiles) {
// 	const command = require(`../../Commands/Basic/ping2`);
// 	commands.push(command.data.toJSON());
// }

// const rest = new REST({ version: '9' }).setToken(token);

// (async () => {
//     try {
//         console.log('Started refreshing application (/) commands.');

//         await rest.put(
//             Routes.applicationGuildCommands(clientId, guildId),
//             { body: commands },
//         );

//         console.log('Successfully reloaded application (/) commands.');
//     } catch (error) {
//         console.error(error);
//     }
// })();




// const { readdirSync, lstatSync } = require("fs");
// const { SlashCommandBuilder } = require('@discordjs/builders');
// const config = require("../../../Config2");
// const dirSetup = config.slashCommandsDirs;
// module.exports = (client) => {
//     console.log("0")//0
//     try {
// 		let allCommands = [];
//         readdirSync("./src/Commands/").forEach((dir) => {
// 			if(lstatSync(`./src/Commands/${dir}`).isDirectory()) {
//                 console.log("1")//1
// 				const groupName = dir;
// 				const cmdSetup = dirSetup.find(d=>d.Folder == dir);
// 				//If its a valid cmdsetup
// 				if(cmdSetup && cmdSetup.Folder) {
// 					//Set the SubCommand as a Slash Builder
// 					const subCommand = new SlashCommandBuilder().setName(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase()).setDescription(String(cmdSetup.CmdDescription));
// 					//Now for each file in that subcommand, add a command!
// 					const slashCommands = readdirSync(`./src/Commands/${dir}/`).filter((file) => file.endsWith(".js"));
// 					for (let file of slashCommands) {
//                         console.log("2")//2
// 						let pull = require(`./src/Commands/${dir}/${file}`);
//                         console.log("3")//3
// 						if (pull.name && pull.description) {
//                             console.log("4")//4
// 							subCommand
// 							.addSubcommand((subcommand) => {
// 								subcommand.setName(String(pull.name).toLowerCase()).setDescription(pull.description)
// 								if(pull.options && pull.options.length > 0){
// 									for(const option of pull.options){
// 										if(option.User && option.User.name && option.User.description){
                                            
// 											subcommand.addUserOption((op) =>
// 												op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required)
// 											)
// 										} else if(option.Integer && option.Integer.name && option.Integer.description){
// 											subcommand.addIntegerOption((op) =>
// 												op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required)
// 											)
// 										} else if(option.String && option.String.name && option.String.description){
// 											subcommand.addStringOption((op) =>
// 												op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required)
// 											)
// 										} else if(option.Channel && option.Channel.name && option.Channel.description){
// 											subcommand.addChannelOption((op) =>
// 												op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
// 											)
// 										} else if(option.Role && option.Role.name && option.Role.description){
// 											subcommand.addRoleOption((op) =>
// 												op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
// 											)
// 										} else if(option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0){
// 											subcommand.addStringOption((op) =>
// 												op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required)
// 												.addChoices(option.StringChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),String(c[1])] )),
// 											)
// 										} else if(option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0){
// 											subcommand.addStringOption((op) =>
// 												op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required)
// 												.addChoices(option.IntChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),parseInt(c[1])] )),
// 											)
// 										} else {
// 											console.log(`A Option is missing the Name or/and the Description of ${pull.name}`)
// 										}
// 									}
// 								}
// 								return subcommand;
// 							})
// 							client.slashCommands.set(String(cmdSetup.CmdName).replace(/\s+/g, '_').toLowerCase() + pull.name, pull)
// 						} else {
// 							console.log(file, `error -> missing a help.name, or help.name is not a string.`.brightRed);
// 							continue;
// 						}
// 					}
// 					//add the subcommand to the array
// 					allCommands.push(subCommand.toJSON());
// 				} 
// 				else {
// 					return console.log(`The Subcommand-Folder ${dir} is not in the dirSetup Configuration!`);
// 				}
// 			} else {
// 				let pull = require(`./src/Commands/${dir}`);
// 				if (pull.name && pull.description) {
// 					let Command = new SlashCommandBuilder().setName(String(pull.name).toLowerCase()).setDescription(pull.description);
// 						if(pull.options && pull.options.length > 0){
// 							for(const option of pull.options){
// 								if(option.User && option.User.name && option.User.description){
// 									Command.addUserOption((op) =>
// 										op.setName(String(option.User.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.User.description).setRequired(option.User.required)
// 									)
// 								} else if(option.Integer && option.Integer.name && option.Integer.description){
// 									Command.addIntegerOption((op) =>
// 										op.setName(String(option.Integer.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Integer.description).setRequired(option.Integer.required)
// 									)
// 								} else if(option.String && option.String.name && option.String.description){
// 									Command.addStringOption((op) =>
// 										op.setName(String(option.String.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.String.description).setRequired(option.String.required)
// 									)
// 								} else if(option.Channel && option.Channel.name && option.Channel.description){
// 									Command.addChannelOption((op) =>
// 										op.setName(String(option.Channel.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Channel.description).setRequired(option.Channel.required)
// 									)
// 								} else if(option.Role && option.Role.name && option.Role.description){
// 									Command.addRoleOption((op) =>
// 										op.setName(String(option.Role.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.Role.description).setRequired(option.Role.required)
// 									)
// 								} else if(option.StringChoices && option.StringChoices.name && option.StringChoices.description && option.StringChoices.choices && option.StringChoices.choices.length > 0){
// 									Command.addStringOption((op) =>
// 										op.setName(String(option.StringChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.StringChoices.description).setRequired(option.StringChoices.required)
// 										.addChoices(option.StringChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),String(c[1])] )),
// 									)
// 								} else if(option.IntChoices && option.IntChoices.name && option.IntChoices.description && option.IntChoices.choices && option.IntChoices.choices.length > 0){
// 									Command.addStringOption((op) =>
// 										op.setName(String(option.IntChoices.name).replace(/\s+/g, '_').toLowerCase()).setDescription(option.IntChoices.description).setRequired(option.IntChoices.required)
// 										.addChoices(option.IntChoices.choices.map(c=> [String(c[0]).replace(/\s+/g, '_').toLowerCase(),parseInt(c[1])] )),
// 									)
// 								} else {
// 									console.log(`A Option is missing the Name or/and the Description of ${pull.name}`)
// 								}
// 							}
// 						}
// 						allCommands.push(Command.toJSON());
// 						client.slashCommands.set("normal" + pull.name, pull)
// 				} 
// 				else {
// 					console.log(file, `error -> missing a help.name, or help.name is not a string.`.brightRed);
// 				}
// 			}
//         });
        
// 		//Once the Bot is ready, add all Slas Commands to each guild
// 		client.on("ready", () => {
// 			if(config.loadSlashsGlobal){
// 				client.application.commands.set(allCommands)
// 				.then(slashCommandsData => {
// 					console.log(`${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`.green} Loaded for all: ${`All possible Guilds`.underline}`.brightGreen); 
// 					console.log(`Because u are Using Global Settings, it can take up to 1 hour until the Commands are changed!`.bold.yellow)
// 				}).catch((e)=>console.log(e));
// 			} else {
// 				client.guilds.cache.map(g => g).forEach((guild) => {
// 					try{
// 						guild.commands.set(allCommands)
// 						.then(slashCommandsData => {
// 							console.log(`${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`.green} Loaded for: ${`${guild.name}`.underline}`.brightGreen); 
// 						}).catch((e)=>console.log(e));
// 					}catch (e){
// 						console.log(String(e).grey)
// 					}
// 				});
// 			}
// 		})
// 		//DISABLE WHEN USING GLOBAL!
// 		client.on("guildCreate", (guild) => {
// 			try{
// 				if(!config.loadSlashsGlobal){
// 					guild.commands.set(allCommands)
// 						.then(slashCommandsData => {
// 							console.log(`${slashCommandsData.size} slashCommands ${`(With ${slashCommandsData.map(d => d.options).flat().length} Subcommands)`.green} Loaded for: ${`${guild.name}`.underline}`.brightGreen); 
// 						}).catch((e)=>console.log(e));
// 				}
// 			}catch (e){
// 				console.log(String(e).grey)
// 			}
// 		})
		
//     } catch (e) {
//         console.log(String(e.stack).bgRed)
//     }
// };
// /**
//  * @INFO
//  * Bot Coded by Tomato#6966 | https://discord.gg/milrato
//  * @INFO
//  * Work for Milrato Development | https://milrato.eu
//  * @INFO
//  * Please mention Him / Milrato Development, when using this Code!
//  * @INFO
//  */