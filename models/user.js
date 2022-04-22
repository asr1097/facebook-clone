const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fbID: {type: String, required: true},
    email: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    gender: {type: String},
    dateOfBirth: {type: String},
    location: {type: String},
    profilePhoto: {type: String},
    friendsList: [{type: Schema.Types.ObjectId, ref: "User"}],
    receivedRequests: [{type: Schema.Types.ObjectId, ref: "User"}],
    sentRequsts: [{type: Schema.Types.ObjectId, ref: "User"}],
    postsList: [{type: Schema.Types.ObjectId, ref: "Post"}],
    commentsList: [{type: Schema.Types.ObjectId, ref: "Comment"}],
})

module.exports = mongoose.model("User", UserSchema);