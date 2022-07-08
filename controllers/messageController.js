const Message = require("../models/message");

exports.getMessages = (req, res, next) => {
    Message.find({$or: {to: req.user.id, from: req.user.id}})
                .sort("date", "desc")
                .then(messages => {
                    res.json(messages)
                })
                .catch(err => console.log(err))
};