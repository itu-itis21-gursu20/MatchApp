// const io = require("socket.io")(8900, {
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// const followingNamespace = io.of('/following');

const { Server } = require('socket.io');

const io = new Server({ cors: "http://localhost:3000"})

let onlineUsers = [];

// const addUser = (userId, socketId) => {
//   console.log("addUser socket");
//   !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
//     console.log("users after add", users);
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
//   console.log("users after remove", users);

// };

// const getUser = (userId) => {
//   console.log("users in getUser", users);
//   return users.find((user) => user.userId === userId);
// };



io.on("connection", (socket) => {
  //when ceonnectfirst
  //take userId and socketId from user
  console.log("A user connected");
  console.log("socketid", socket.id);

  // socket.on("addNewUser", (userId) => {
  //   if(!onlineUsers.some((user) => user.userId === userId) && userId !== null){
  //     onlineUsers.push({
  //       userId,
  //       socketId: socket.id
  //     });
  //   }
  //   console.log("onlineUsers", onlineUsers);
  // });

  // socket.on("addNewUser", (userId) => {
  //   if (userId !== null) {
  //     const userIndex = onlineUsers.findIndex((user) => user.userId === userId);
  
  //     // If user is found in onlineUsers
  //     if (userIndex !== -1) {
  //       // Update the socketId for the user
  //       onlineUsers[userIndex].socketId = socket.id;
  //     } else {
  //       // Otherwise, add new user to the onlineUsers
  //       onlineUsers.push({
  //         userId,
  //         socketId: socket.id
  //       });
  //     }
  //     console.log("onlineUsers", onlineUsers);
  //   }
  // });
  socket.on("addNewUser", (userId) => {
    if (userId !== null) {
      const userIndex = onlineUsers.findIndex((user) => user.userId === userId);
  
      // If user is found in onlineUsers
      if (userIndex !== -1) {
        // Add the new socketId to the user's socketIds array
        // But only if it doesn't exist yet (to prevent duplicates)
        if(!onlineUsers[userIndex].socketIds.includes(socket.id)) {
          onlineUsers[userIndex].socketIds.push(socket.id);
        }
      } else {
        // Otherwise, add new user to the onlineUsers with new socketId array
        onlineUsers.push({
          userId,
          socketIds: [socket.id]
        });
      }
      console.log("onlineUsers", onlineUsers);
    }
  });
  

  // socket.on("addNewUser", (userId) => {
  //   if (userId !== null) {
     
  //       onlineUsers.push({
  //         userId,
  //         socketId: socket.id
  //       });
      
  //     console.log("onlineUsers", onlineUsers);
  //   }
  // });


  io.emit("getOnlineUsers", onlineUsers);

  // //send and get message
  // socket.on("sendMessage", (message) => {
  //   const user = onlineUsers.find(user => user.userId === message.friendId);

  //   if(user){
  //     io.to(user.socketId).emit("getMessage", message);
  //     io.to(user.socketId).emit("getNotification", {
  //       senderId: message.sender,
  //       isRead: false,
  //       date: new Date()
  //     });
  //   }
  // });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find(user => user.userId === message.friendId);
  
    if (user && user.socketIds) {
      user.socketIds.forEach(socketId => {
        io.to(socketId).emit("getMessage", message);
        io.to(socketId).emit("getNotification", {
          text: message.text,
          senderId: message.sender,
          senderName: message.senderName,
          isRead: false,
          date: new Date()
        });
      });
    }
  });

  socket.on("follow", (info) => { // follower user follows followedUser
    // bu bildirim follower userda gözükmemeli

    console.log("follow in socket");
    const followedUser = onlineUsers.find(user => user.userId === info.followedId);
    console.log("followed user", followedUser);
    const followerUser = onlineUsers.find(user => user.userId === info.followerId);
    console.log("follower user", followerUser);


    if(followedUser && followedUser.socketIds) {
      followedUser.socketIds.forEach(socketId => {
        io.to(socketId).emit("getFollowingInfo", {
          followerUsername: info.followerUsername,
          date: new Date()
        })
      })
    }
    if(followerUser && followerUser.socketIds) {
      followerUser.socketIds.forEach(socketId => {
        io.to(socketId).emit("getFollowingInfo", {
          followerUsername: info.followerUsername,
          date: new Date()
        })
      })
    }
  })

  socket.on("unfollow", (info) => {

    console.log("unfollow in socket");
    const unfollowedUser = onlineUsers.find(user => user.userId === info.unfollowedId);
    console.log("unfollowed user", unfollowedUser);
    const unfollowerUser = onlineUsers.find(user => user.userId === info.unfollowerId);
    console.log("unfollower user", unfollowerUser);

    if(unfollowedUser && unfollowedUser.socketIds) {
      unfollowedUser.socketIds.forEach(socketId => {
        io.to(socketId).emit("getUnfollowingInfo", {
          unfollowerUsername: info.unfollowerUsername,
          date: new Date()
        })
      })
    }
    if(unfollowerUser && unfollowerUser.socketIds) {
      unfollowerUser.socketIds.forEach(socketId => {
        io.to(socketId).emit("getUnfollowingInfo", {
          unfollowerUsername: info.unfollowerUsername,
          date: new Date()
        })
      })
    }
  })

  // socket.on("following", (text) => {
  //   console.log("online userssss", onlineUsers);
  //   const user = onlineUsers.find(user => user.userId === text); // user = berkay
  //   console.log("user in socket", user);
  //   console.log("text in socket", text);
  //   if (user && user.socketIds) {
  //     user.socketIds.forEach(socketId => {
  //       io.to(socketId).emit("getText", text);
  //     });
  //   }
  // })

  

  // socket.on("sendNotification", ({ senderId, receiverId, text }) => {
  //   console.log("senderId in notif socket", senderId);
  //   console.log("receiverId in notif socket", receiverId);
  //   console.log("text in notif socket", text);
  //   const receiver = getUser(receiverId);
  //   console.log("receiver in notif socket", receiver);
  //   io.to(receiver.socketId).emit("getNotification", {
  //     senderId,
  //     text
  //   });
  // });

  // //when disconnect
  // socket.on("disconnect", () => {
  //   console.log("A user disconnected!");
  //   onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
  //   io.emit("getUsers", onlineUsers);
  // });
  socket.on('disconnect', () => {
    const userIndex = onlineUsers.findIndex(user => user.socketIds.includes(socket.id));

    if (userIndex !== -1) {
        // Remove the socket.id from the user's socketIds array
        onlineUsers[userIndex].socketIds = onlineUsers[userIndex].socketIds.filter(sid => sid !== socket.id);

        // If the user doesn't have any more active sockets, remove them from onlineUsers
        if (onlineUsers[userIndex].socketIds.length === 0) {
            onlineUsers.splice(userIndex, 1);
        }
    }

    console.log('User disconnected', socket.id);
    console.log('onlineUsers', onlineUsers);
});


});

io.listen(8900);


// followingNamespace.on('connection', (socket) => {
//   console.log('A user connected to the following namespace.');

//   socket.on('followUser', (data) => {
//       // Handle the follow user event.
//       // e.g., add the user to the following list of another user
//       console.log("data",data);
//       const receiver = getUser(data.id);
//       io.emit('muzaffer');
//   });

//   socket.on('unfollowUser', (data) => {
//       // Handle the unfollow user event.
//       // e.g., remove the user from the following list of another user
//   });

//   socket.on('disconnect', () => {
//       console.log('A user disconnected from the following namespace.');
//   });
// });
