const Reply = require('../../Structures/Handlers/replyHandler')

module.exports = {
    name: 'removeduplicates',
    aliases: ['removedupes', 'rd'],
    description: 'Removes duplicate songs from the queue',
    category: 'music',
    run: (message, client, Discord, args, cmd) => {
        let guildQueue = client.player.getQueue(message.guild.id);
        if (!message.member.voice.channel && message.member.user.id != process.env.OWNER) return Reply.send(message, { content: 'Join a voice channel first!', ephemeral: true })
        rdupes(message, client, Discord, args, cmd, guildQueue);
    }
}

function rdupes(message, client, Discord, args, cmd, guildQueue) {
    try {
        const uniques = []
        guildQueue.songs = guildQueue.songs.filter((song, i) => uniques.includes(song.url) ? false : (uniques.push(song.url), true))
        Reply.send(message, `Exact duplicates have been removed`)
    } catch (error) {
        console.log(error)
    }
}