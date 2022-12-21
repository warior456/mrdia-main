const { Schema, model } = require('mongoose');
const queueSchema = new Schema({
    _id: Schema.Types.ObjectId,
    queueName: String,
    serverId: String,
    queueOwner: String,
    songUrl: [String],
})

module.exports = model("Queue", queueSchema, "savedQueues");