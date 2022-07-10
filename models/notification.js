const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    type: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, ref: "User", required: true},
    commentID: {type: Schema.Types.ObjectId, ref: "Comment"},
    postID: {type: Schema.Types.ObjectId, ref: "Post"},
    profileID: {type: Schema.Types.ObjectId, ref: "User", required: true},
    date: {type: Date, required: true},
    read: {type: Boolean, default: false, required: true}
});

module.exports = mongoose.model("Notification", NotificationSchema);