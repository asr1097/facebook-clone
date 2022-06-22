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
        User.findByIdAndUpdate(req.body.profileID, {$push: {receivedRequests: req.user.id}}),
        User.findByIdAndUpdate(req.user.id, {$push: {sentRequests: req.body.profileID}})
    ]).then(result => console.log("Request sent!")).catch(err => console.log(err))
};

/* Accept friend request */
exports.acceptFriendRequest = (req, res, next) => {
    Promise.all([
        User.findByIdAndUpdate(req.body.profileID, {$pull: {sentRequests: req.user.id}}),
        User.findByIdAndUpdate(req.body.profileID, {$push: {friendsList: req.user.id}}),
        User.findByIdAndUpdate(req.user.id, {$pull: {receivedRequests: req.body.profileID}}),
        User.findByIdAndUpdate(req.user.id, {$push: {friendsList: req.body.profileID}})
    ]).then(result => console.log("Friend added.")).catch(err => console.log(err))
};

/* Reject friend request */
exports.rejectFriendRequest = (req, res, next) => {
    Promise.all([
        User.findByIdAndUpdate(req.body.profileID, {$pull: {sentRequests: req.user.id}}),
        User.findByIdAndUpdate(req.user.id, {$pull: {receivedRequests: req.body.profileID}})
    ]).then(result => console.log("Friend request rejected.")).catch(err => console.log(err))
};

/* Cancel friend request */
exports.cancelFriendRequest = (req, res, next) => {
    Promise.all([
        User.findByIdAndUpdate(req.body.profileID, {$pull: {receivedRequests: req.user.id}}),
        User.findByIdAndUpdate(req.user.id, {$pull: {sentRequests: req.body.profileID}})
    ]).then(result => console.log("Friend request canceled.")).catch(err => console.log(err))
};

/* Remove friend */
exports.removeFriend = (req, res, next) => {
    Promise.all([
        User.findByIdAndUpdate(req.body.profileID, {$pull: {friendsList: req.user.id}}),
        User.findByIdAndUpdate(req.user.id, {$pull: {friendsList: req.body.profileID}})
    ]).then(result => console.log("Friend removed.")).catch(err => console.log(err))
};

exports.deleteUser = (req, res, next) => {
    Promise.all([
        Comment.deleteMany({user: req.user.id}),
        Post.deleteMany({user: req.user.id}),
        User.findByIdAndDelete(req.user.id)
    ]).then(done => console.log("User deleted")).catch(err => res.json(err));
};

