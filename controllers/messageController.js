const Message = require("../models/message");

exports.getMessages = (req, res, next) => {
    Message.find({$or: [{to: req.user.id}, {from: req.user.id}]})
                .populate(["from", "to"])
                .sort({"date": "asc"})
                .then(messages => {
                    res.json(messages)
                })
                .catch(err => console.log(err))
};

exports.readMessages = (req, res) => {
    let messageArray = req.body.readMessages.split(",")
    Message.updateMany({_id: {$in: messageArray}}, {read: true})
        .then(msgs => {
            if(res.io.sockets.adapter.rooms.has(req.body.friend)){
                res.io.to(req.body.friend).emit("message read", req.user.id);
            }
            res.sendStatus(200)
        })
        .catch(err => console.log(err));
};