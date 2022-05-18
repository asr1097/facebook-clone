const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, maxlength: 999},
    image: {type: String},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    date: {type: Date, default: Date.now()}
});

module.exports = mongoose.model("Post", PostSchema);