const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'removeduplicates',
    aliases: ['removedupes', 'rd'],
    description: 'Removes duplicate songs from the queue',
    category: 'music',
    run: (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.author.id != process.env.OWNER) return Reply.send('Join a voice channel first!')
        rdupes(message, client, Discord, args, cmd, guildQueue);
    }
}

function rdupes(message, client, Discord, args, cmd, guildQueue) {
    try {
        const uniques = []
        guildQueue.songs = guildQueue.songs.filter((song, i) => uniques.includes(song.url) ? false : (uniques.push(song.url), true))
        Reply.send(`Exact duplicates have been removed`)
    } catch (error) {
        console.log(error)
    }
}