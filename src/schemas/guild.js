const { Schema, model } = require('mongoose');
const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    guildQueues: [String],
    guildIcon: { type: String, required: false }
})

module.exports = model("Guild", guildSchema, "guilds");