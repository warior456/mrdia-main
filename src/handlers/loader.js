const { readdirSync } = require('fs');
const { Collection } = require('discord.js');

client.commands = new Collection();

const events = readdirSync('./src/events/').filter(file => file.endsWith('.js'));

console.log(`Loading events...`);

for (const file of events) {
    const event = require(`../events/${file}`);
    console.log(`-> Loaded event ${file.split('.')[0]}`);
    client.on(file.split('.')[0], event.bind(null, client));
    delete require.cache[require.resolve(`../events/${file}`)];
};

console.log(`Loading commands...`);

readdirSync('./src/commands/').forEach(dirs => {
    const commands = readdirSync(`./src/commands/${dirs}`).filter(files => files.endsWith('.js'));
try {
    for (const file of commands) {
        const command = require(`../commands/${dirs}/${file}`);
        console.log(`-> Loaded command ${command.name}`);
        client.commands.set(command.name.toLowerCase(), command);
        delete require.cache[require.resolve(`../commands/${dirs}/${file}`)];
    };
} catch (error) {
    console.log(error)
}
    
});