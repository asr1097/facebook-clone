const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Notification = require("../models/notification");
const helpers = require("../helpers");
const { body, validationResult } = require("express-validator");

/* Get user profile*/
exports.getUser = (req, res, next) => {
    Promise.all([
        User.findById(req.params.id)
            .populate("friendsList"),

        Post.find({user: req.params.id})
            .sort({"date": "desc"})
            .populate([
                "likes", 
                "directComments",
                "user", 
                {path: "directComments", populate: {path: "user"}},
                {path: "directComments", populate: {path: "likes"}},
            ])
    ])
        .then(response => res.status(200).json(response))
        .catch(err => console.log(err));
};

exports.getLoggedUser = (req, res, next) => {
    User.findById(req.user.id)
        .populate(["friendsList", "receivedRequests"])
        .then(populatedFL => {
            res.json({user: req.user, populatedFL: populatedFL})
        });
};

/* Send friend request */
exports.sendFriendRequest = (req, res, next) => {
    Promise.all([
        User.findByIdAndUpdate(req.body.profileID, {$push: {receivedRequests: req.user.id}}),
        User.findByIdAndUpdate(req.user.id, {$push: {sentRequests: req.body.profileID}})
    ]).then(result => res.sendStatus(200)).catch(err => res.sendStatus(418))
};

/* Accept friend request */
exports.acceptFriendRequest = [

    (req, res, next) => {
        Promise.all([
            User.findByIdAndUpdate(req.body.profileID, {$pull: {sentRequests: req.user.id}}),
            User.findByIdAndUpdate(req.body.profileID, {$push: {friendsList: req.user.id}}),
            User.findByIdAndUpdate(req.user.id, {$pull: {receivedRequests: req.body.profileID}}),
            User.findByIdAndUpdate(req.user.id, {$push: {friendsList: req.body.profileID}})
        ]).then(result => {next()}).catch(err => res.sendStatus(418))
    },

    (req, res, next) => {
        const newNotification = new Notification({
            profileID: req.user.id,
            user: req.body.profileID,
            type: "friend request accepted",
            date: Date.now()
        })
        newNotification.save().then(notif => {
            if(res.io.sockets.adapter.rooms.has(req.body.profileID)) {
                res.io.to(req.body.profileID).emit("new notification", notif);
                res.sendStatus(200);
            } else {res.sendStatus(200)}
        }).catch(err => console.log(err))
    }
]

/* Reject friend request */
exports.rejectFriendRequest = (req, res, next) => {
    Promise.all([
        User.findByIdAndUpdate(req.body.profileID, {$pull: {sentRequests: req.user.id}}),
        User.findByIdAndUpdate(req.user.id, {$pull: {receivedRequests: req.body.profileID}})
    ]).then(result => res.sendStatus(200)).catch(err => res.sendStatus(418))
};

/* Cancel friend request */
exports.cancelFriendRequest = (req, res, next) => {
    Promise.all([
        User.findByIdAndUpdate(req.body.profileID, {$pull: {receivedRequests: req.user.id}}),
        User.findByIdAndUpdate(req.user.id, {$pull: {sentRequests: req.body.profileID}})
    ]).then(result => res.sendStatus(200)).catch(err => res.sendStatus(418))
};

/* Remove friend */
exports.removeFriend = (req, res, next) => {
    Promise.all([
        User.findByIdAndUpdate(req.body.profileID, {$pull: {friendsList: req.user.id}}),
        User.findByIdAndUpdate(req.user.id, {$pull: {friendsList: req.body.profileID}})
    ]).then(result => console.log("Friend removed.")).catch(err => console.log(err))
};

/* 
    Delete user's comments and all of children comments,
    user's posts and user at the end.
*/
exports.deleteUser = (req, res, next) => {
    Comment.find({user: req.user.id}).then(async (comments) => {
        let commentsToDelete = [];
        comments.forEach(comment => commentsToDelete.push(comment._id.toString()));
        for(let i = 0; i < commentsToDelete.length; i++) {
            let comments = await helpers.findChildComments(commentsToDelete[i]);
            if(comments){
                let newCommentsToDelete = [...commentsToDelete, ...comments];
                commentsToDelete = newCommentsToDelete
            };
        }
        Promise.all([
            Comment.deleteMany({$_id: {$in: commentsToDelete}}),
            Post.deleteMany({user: req.user.id}),
            User.findByIdAndDelete(req.user.id)
        ]).then(done => console.log("User deleted")).catch(err => res.json(err));
    })
    
};

exports.editProfile = [
    body("firstName").exists().isLength({max: 99}).trim().escape(),
    body("lastName").exists().isLength({max: 99}).trim().escape(),
    body("location").exists().isLength({max: 99}).trim().escape(),
    body("gender").exists().escape(),
    body("DOB").exists().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.json({err: "Text field must have maximum of 999 characters."})
		} else {
            User.findByIdAndUpdate(req.user.id, {
                "name.first": req.body.firstName,
                "name.last": req.body.lastName,
                "name.full": req.body.firstName + " " + req.body.lastName,
                gender: req.body.gender,
                location: req.body.location,
                dateOfBirth: new Date(req.body.DOB)
            }).then(user => res.sendStatus(200)).catch(err => res.json(err))
        }
    }
];

exports.registerUser = [
    body("firstName").exists().isLength({max: 99}).trim().escape(),
    body("lastName").exists().isLength({max: 99}).trim().escape(),
    body("location").exists().isLength({max: 99}).trim().escape(),
    body("gender").exists().escape(),
    body("DOB").exists().escape(),

    (req, res, next) => {
        let newUser = new User({
            firstName
        })
    }
]

exports.getPhotos = [

    helpers.areFriends,

    (req, res, next) => {
        Post.find({$and: [{user: req.params.id}, {image: {$exists: true, $ne: null}}]})
            .sort({"date": "desc"})
            .populate([
                    "likes", 
                    "directComments",
                    "user", 
                    {path: "directComments", populate: {path: "user"}},
                    {path: "directComments", populate: {path: "likes"}},
                ])
            .then(photos => {
                console.log(photos)
                res.status(200).json(photos)})
            .catch(err => {
                console.log(err)
                res.json(err)
            })
    }
]

exports.searchUsers = (req, res, next) => {
    User.find({"name.full": {$regex: req.body.name, $options: "i"}})
        .then(users => {res.json(users)})
        .catch(err => res.json(err))
};

