const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    userId: String,
    userName: String,
    userIcon: { type: String, required: false },
    userFavoriteLinks: [String],
    userFavoriteNames: [String],
})

module.exports = model("User", userSchema, "users");