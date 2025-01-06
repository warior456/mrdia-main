const { Schema, model } = require('mongoose');
const queueSchema = new Schema({
    _id: Schema.Types.ObjectId,
    queueName: String,
    serverId: String,
    queueOwnerId: String,
    songUrls: [String],
})
queueSchema.index({ serverId: 1, queueName: 1, queueOwnerId }, { unique: true });

module.exports = model("Queue", queueSchema, "savedQueues");