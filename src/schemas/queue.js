const { Schema, model } = require('mongoose');
const queueSchema = new Schema({
    _id: Schema.Types.ObjectId,
    queueName: String,
    serverId: String,
    queueOwnerId: String,
    queueOwnerName: String,
    songs: [{
        url: String,
        name: String,
        requestedBy: String,
        requestedByName: String,
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})
queueSchema.index({ serverId: 1, queueName: 1, queueOwnerId:1 }, { unique: true });

module.exports = model("Queue", queueSchema, "savedQueues");