const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "user", required: true},
    text: {type: String, maxlength: 999},
    image: {type: String},
    comments: [{type: Schema.Types.ObjectId, ref: "comment"}],
    likes: {type: Number, default: 0},
    date: {type: Date}
});

module.exports = mongoose.model("post", PostSchema);