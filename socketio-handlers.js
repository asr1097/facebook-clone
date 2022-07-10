require("dotenv").config();
const mongoose = require("mongoose");
const Message = require("./models/message");

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

module.exports = (io) => {

    let activeSockets = [];

    io.on("connection", (socket) => {
        activeSockets.push({
          SID: socket.id,
          userID: socket.userID
        });
      
        socket.join(socket.userID);
      
        console.log("User connected: " + socket.userID);
        
        io.to(socket.userID).emit("activeUsers", activeSockets);

        socket.broadcast.emit("new connection", socket.userID);
      
        socket.on("message", (msg) => {
            let newMessage = new Message({
              from: msg.from,
              to: msg.to,
              content: {
                  text: msg.content.text,
                  date: msg.content.date
                  
              }});
            if(io.sockets.adapter.rooms.has(msg.to)){
                newMessage.save().then(savedMsg => {
                    io.to(msg.to).to(socket.id).emit("new message", savedMsg);
                }).catch(err => console.log(err));
            } else {
                newMessage.save().then(savedMsg => {
                    io.to(socket.id).emit("new message", savedMsg);
            })};
        });
      
        socket.on("disconnect", () => {
          const indexOfSocket = activeSockets.findIndex(activeSocket => 
            activeSocket.userID === socket.userID);
          let discUser = activeSockets.splice(indexOfSocket, 1);
          socket.broadcast.emit("user disconnected", discUser[0].userID);
          console.log("User disconnected: " + discUser[0].userID)
        })
      })
}
