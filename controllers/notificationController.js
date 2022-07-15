const Notification = require("../models/notification");

exports.getNotifications = (req, res, next) => {
    Notification.find({user: req.user.id})
        .sort("date", "asc")
        .populate(["user", "postID", "commentID", "parentCommentID", "newCommentID", "profileID"])
        .then(notifs => {res.json(notifs)})
        .catch(err => console.log(err))
};

exports.readNotifications = (req, res, next) => {
    Notification.updateMany({$id: {$in: req.body.notifs}}, {read: true})
        .then(notifs => res.sendStatus(200))
        .catch(err => console.log(err))
};