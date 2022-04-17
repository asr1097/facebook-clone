const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "user"},
    text: {type: String},
    commentsList: [{type: Schema.Types.ObjectId, ref: "comment"}],
    likes: {type: Number, default: 0},
    date: {type: Date}
});

module.exports = mongoose.model("comment", CommentSchema);