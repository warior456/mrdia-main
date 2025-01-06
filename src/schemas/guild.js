const { Schema, model } = require('mongoose');
const guildSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    guildQueues: [String],
    guildIcon: { type: String, required: false }
})
guildSchema.index({ guildId: 1 }, { unique: true });
module.exports = model("Guild", guildSchema, "guilds");