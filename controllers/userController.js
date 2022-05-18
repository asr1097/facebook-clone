const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");

/* Get user profile*/
exports.getUser = (req, res, next) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => console.log(err));
};

/* Send friend request */
exports.sendFriendRequest = (req, res, next) => {
    Promise.all([
        User.findByIdAndUpdate(req.body.receiverID, {$push: {receivedRequests: req.user.id}}),
        User.findByIdAndUpdate(req.user.id, {$push: {sentRequests: req.body.receiverID}})
    ]).then(result => console.log("Request sent!")).catch(err => console.log(err))
};

