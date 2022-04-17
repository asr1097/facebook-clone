const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    post: {type: Schema.Types.ObjectId, ref: "Post"},
    text: {type: String},
    commentsList: [{type: Schema.Types.ObjectId, ref: "Comment"}],
    likes: {type: Number, default: 0},
    date: {type: Date}
});

module.exports = mongoose.model("Comment", CommentSchema);