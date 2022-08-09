const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    from: {type: Schema.Types.ObjectId, ref: "User", required: true},
    to: {type: Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, minlength: 1, maxlength: 999},
    date: {type: Date, required: true},
    read: {type: Boolean, default: false}
});

module.exports = mongoose.model("Message", MessageSchema);