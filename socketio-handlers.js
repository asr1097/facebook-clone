module.exports = (io) => {

    let activeSockets = [];

    io.on("connection", (socket) => {
        activeSockets.push({
          SID: socket.id,
          userID: socket.userID
        });
      
        socket.join(socket.userID)
      
        console.log("User connected: " + socket.userID)
        
        io.to(socket.userID).emit("activeUsers", activeSockets)
      
        socket.broadcast.emit("new connection", socket.userID)
      
        socket.on("message", (msg) => {
            console.log("Message sent from " + msg.from + " to " + msg.to)
            socket.to(msg.to).emit("new message", msg)
        })
      
        socket.on("disconnect", () => {
          const indexOfSocket = activeSockets.findIndex(activeSocket => 
            activeSocket.userID === socket.userID);
          let discUser = activeSockets.splice(indexOfSocket, 1);
          socket.broadcast.emit("user disconnected", discUser[0].userID);
          console.log("User disconnected: " + discUser[0].userID)
        })
      })
}
