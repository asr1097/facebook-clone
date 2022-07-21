const Notification = require("../models/notification");

exports.getNotifications = (req, res, next) => {
    Notification.find({user: req.user.id})
        .sort({"date": "desc"})
        .populate("user")
        .populate("postID")
        .populate("commentID")
        .populate("parentCommentID")
        .populate("newCommentID")
        .populate("profileID")
        .then(notifs => {res.json(notifs)})
        .catch(err => console.log(err))
};

exports.readNotifications = (req, res, next) => {
    let notifsArray = req.body.notifs.split(",");
    Notification.updateMany({$id: {$in: notifsArray}}, {read: true})
        .then(notifs => res.sendStatus(200))
        .catch(err => console.log(err))
};