const { Schema, model } = require('mongoose');
const queueSchema = new Schema({
    _id: Schema.Types.ObjectId,
    queueId: String,
    queueName: String,
    serverId: String,
    songUrl: [String],
})

module.exports = model("Queue", queueSchema, "savedQueues");