const Notification = require("../models/notification");

exports.getNotifications = (req, res, next) => {
    Notification.find({user: req.user.id})
        .then(notifs => {res.json(notifs)})
        .catch(err => console.log(err))
};