const { PermissionsBitField } = require("discord.js");
const { nowPlaying } = require("./nowPlayingFunction");
const { toHHMMSS } = require("../utilities")

function seekTo(queue, timestamp) {
    queue.seek(timestamp)
    return `seeked to ${toHHMMSS(timestamp)}`
}

function seekMessage(client, queue) {
    return nowPlaying(client, queue)
}

function validateTimestamp(queue, timestamp) {
    songDuration = queue.songs[0].duration
    if (timestamp > songDuration) {
        timestamp = songDuration
    }
    if (timestamp < 0) {
        timestamp = 0
    }
    return timestamp;
}

module.exports = {
    seekTo, seekMessage, validateTimestamp
};


