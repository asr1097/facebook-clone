const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, maxlength: 999},
    image: {type: String},
    likes: [{type: Schema.Types.ObjectId, ref: "User"}],
    comments: [{type: Schema.Types.ObjectId, ref: "Comment", default: []}],
    directComments: [{type: Schema.Types.ObjectId, ref: "Comment", default: []}],
    date: {type: Date, default: Date.now()}
}, {toJSON: {virtuals: true}});

PostSchema.virtual("url").get(function() {
    return "posts/" + this._id 
});

module.exports = mongoose.model("Post", PostSchema);