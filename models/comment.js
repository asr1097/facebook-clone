const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    post: {type: Schema.Types.ObjectId, ref: "Post"},
    text: {type: String, maxlength: 999},
    parentComment: {type: Schema.Types.ObjectId, ref: "Comment"},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    date: {type: Date, default: Date.now()}
}, {toJSON: {virtuals: true}});

CommentSchema.virtual("url").get(function() {
    return "comments/" + this._id
})

module.exports = mongoose.model("Comment", CommentSchema);