const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fbID: {type: String, required: true},
    email: {type: String},
    name: {
        first: {type: String},
        last: {type: String},
        full: {type: String}
    },
    gender: {type: String},
    dateOfBirth: {type: String},
    location: {type: String},
    profilePhoto: {type: String},
    friendsList: [{type: Schema.Types.ObjectId, ref: "User"}],
    receivedRequests: [{type: Schema.Types.ObjectId, ref: "User"}],
    sentRequests: [{type: Schema.Types.ObjectId, ref: "User"}],
}, {toJSON: {virtuals: true}});

UserSchema.pre("save", function(next) {
    this.name.full = this.name.first + " " + this.name.last;
    return next();
});

UserSchema.pre("insertMany", function(next, docs) {
    docs.map(doc => {
        doc.name.full = doc.name.first + " " + doc.name.last;
    })
    return next();
});

UserSchema.virtual("url").get(function() {
    return "profile/" + this._id;
});

module.exports = mongoose.model("User", UserSchema);