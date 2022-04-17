const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {type: String, required: true},
    password: {type: String, minlength: 8, required: true},
    firstName: {type: String, minlength: 2, required: true},
    lastName: {type: String, minlength: 2, required: true},
    address: {type: String, required: true},
    sex: {type: String, enum: ["male", "female"], default: "male", required: true},
    dateOfBirth: {type: Date},
    profilePhoto: {type: String},
    friendsList: [{type: Schema.Types.ObjectId, ref: "User"}],
    receivedRequests: [{type: Schema.Types.ObjectId, ref: "User"}],
    sentRequsts: [{type: Schema.Types.ObjectId, ref: "User"}],
    postsList: [{type: Schema.Types.ObjectId, ref: "Post"}],
    commentsList: [{type: Schema.Types.ObjectId, ref: "Comment"}],
})

module.exports = mongoose.model("user", UserSchema);