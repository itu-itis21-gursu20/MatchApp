import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { following, unfollowing } from "../redux/userRedux";
import { useLocation } from 'react-router-dom';

export const ChatContext = createContext();

export const ChatContextProvider = ({children, user}) => {

  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [followingInfo, setFollowingInfo] = useState(null);
  const [unfollowingInfo, setUnfollowingInfo] = useState(null);
  const [currentUserDetails, setCurrentUserDetails] = useState(null);
  const [accountUserDetails, setAccountUserDetails] = useState(null);
  const [accountOwner, setAccountOwner] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const dispatch = useDispatch();
  
  const location = useLocation();
  const id = location.pathname.split('/')[2];

  useEffect(() => {
    const newSocket = io("http://localhost:8900");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    }
  }, [user]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res)
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null) return;

    const friendId = currentChat?.members?.find((id) => id !== user?._id);
    console.log("friendId", friendId);
    console.log("...newMessage", newMessage);
    socket.emit("sendMessage", { ...newMessage, friendId });

  }, [newMessage]);


  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);



  useEffect(() => { 
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if(currentChat?._id !== res.conversationId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {

      const isChatOpen = currentChat?.members?.some((id) => { // furkan berkay chati var, berkayda ghezzalın chat açık, furkan berkaya mesaj gönderiyor

        return id !== res.senderId; // sender = furkan
      });
      if(isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    })

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    }

  }, [socket, currentChat]);


  const mahmut = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUser = mahmut && JSON.parse(mahmut).currentUser;
  const TOKEN = currentUser?.accessToken;
  //console.log("token", TOKEN)


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/users/find/${id}`);
        setAccountOwner(res.data);
      } catch(err) {
        console.log(err);
      }
    };
    getUser();
  }, [id]);

  useEffect(() => {
      const getUsers = async () => {
        try {
          const res = await axios.get("/users");
          const pChats = res.data.filter((u) => {
              let isChatCreated = false;
              if(user?._id === u?._id) return false;

              if(userChats) {
                  isChatCreated = userChats?.some((chat) => {
                      return chat.members[0] === u._id || chat.members[1] === u._id;
                  })
              }

              return !isChatCreated; 
          });
          setPotentialChats(pChats);
          setAllUsers(res.data);
        } catch (err) {
          console.log(err);
        }
      };
      getUsers();
    }, [userChats])

  const createChat = useCallback(async (receiverId) => {
    try {
      const res = await axios.post("/conversations", { senderId: user._id, receiverId });
      setUserChats((prev) => [...prev, res.data]);
    } catch (err) {
      console.log(err);
    }
  },[]);

  useEffect(() => {
      const getUserChats = async () => {
        if(user?._id){
            setIsUserChatsLoading(true);
            setUserChatsError(null);
            try {
              const res = await axios.get("/conversations/" + user?._id);
              setIsUserChatsLoading(false);
              setUserChats(res.data);
            } catch (err) {
              console.log(err);
            }
        } 
      };
      getUserChats();
    }, [user, notifications]);


  useEffect(() => {
    const getMessages = async () => {
        setIsMessagesLoading(true);
        setMessagesError(null);
        try {
            const res = await axios.get("/messages/" + currentChat?._id);
            setIsMessagesLoading(false);
            setMessages(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback( async (textMessage, sender, currentChatId, setTextMessage) => {
    if(!textMessage) return console.log("You must type a text message");
        console.log(textMessage, sender, currentChatId);
    try {
      console.log("sender", sender);
        const res = await axios.post("/messages", 
        {
            conversationId: currentChatId,
            sender: sender._id,
            senderName: sender.username,
            text: textMessage,
        })
        setMessages((prev) => [...prev, res.data]);
        console.log("newMessage", res.data);
        setNewMessage(res.data);
    } catch (err) {
        setSendTextMessageError(err);
        console.log(err);
    }

    setTextMessage("");
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => (
      { ...n, isRead: true}
    ));
    setNotifications(mNotifications);
  }, [])

  const markNotificationAsRead = useCallback((n, userChats, user, notifications) => {
    const desiredChat = userChats.find((chat) => {
      const chatMembers = [user._id, n.senderId];
      const isDesiredChat = chat?.members.every((member) => {
        return chatMembers.includes(member);
      });
      return isDesiredChat;
    });

    const mNotifications = notifications.map((el) => {
      if(n.senderId === el.senderId) {
        return { ...n, isRead: true };
      } else {
        return el;
      }
    });

    updateCurrentChat(desiredChat);
    setNotifications(mNotifications);
  }, []);

  const markThisUserNotificationAsRead = useCallback((thisUserNotifications, notifications) => {
    const mNotifications = notifications.map((el) => {
      let notification;

      thisUserNotifications.forEach((n) => {
        if(n.senderId === el.senderId) {
          notification = { ...n, isRead: true };
        } else {
          notification = el;
        }
      });
      return notification;
    });
    setNotifications(mNotifications);
  }, []);



  const handleFollowing = useCallback(async (currentUser, id) => { // current user follows account owner

      console.log("follow click")
      await axios.put(`/users/follow/${id}`, {}, {
        headers: {
          token: `Bearer ${TOKEN}`
        }
      });

      dispatch(following({currentUserId: currentUser?._id, id: id}));

      // const res = await axios.get(`/users/find/${id}`, {}, {
      //   headers: {
      //     token: `Bearer ${TOKEN}`
      //   }
      // });
      // setAccountOwner(res.data);

      socket?.emit("follow", { followerUsername: currentUser?.username, followerId: currentUser?._id, followedId: id });

      setRefresh(prev => !prev); 
  }, [socket, id]);


  useEffect(() => {
      socket?.on("getFollowingInfo", (i) => {
        setFollowingInfo(i);
      })
  }, [socket]);

  useEffect(() => {
    socket?.on("getUnfollowingInfo", (i) => {
      setUnfollowingInfo(i);
    })
}, [socket]);


  useEffect(() => {
    const getUser = async () => {
      try {
        const resCur = await axios.get(`/users/find/${currentUser?._id}`);
        console.log("resCur", resCur.data);
        setCurrentUserDetails(resCur.data);
        const resAcc = await axios.get(`/users/find/${id}`);
        console.log("resAcc", resAcc.data);
        setAccountUserDetails(resAcc.data);
      } catch(err) {
        console.log(err);
      }
    };
    getUser();
}, [followingInfo, unfollowingInfo, id, refresh]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/users/find/${id}`);
        console.log("get acc owner");
        setAccountUserDetails(res.data);
      } catch(err) {
        console.log(err);
      }
    };
    getUser();
  }, [accountOwner, followingInfo]);

  const handleUnfollowing = useCallback(async (currentUser, id) => { // current user follows account owner
      
    console.log("unfollow click");

    await axios.put(`/users/unfollow/${id}`, {}, {
      headers: {
        token: `Bearer ${TOKEN}`
      } 
    });
    dispatch(unfollowing({currentUserId: currentUser?._id, id: id}));

    // const res = await axios.get(`/users/find/${id}`, {}, {
    //   headers: {
    //     token: `Bearer ${TOKEN}`
    //   }
    // });
    // setAccountOwner(res.data);

    socket?.emit("unfollow", { unfollowerUsername: currentUser?.username, unfollowerId: currentUser?._id, unfollowedId: id });

    setRefresh(prev => !prev); 

  }, [socket, id]);


  // useEffect(() => {
  //     socket?.on("getUnfollowingInfo", (i) => {
  //       setUnfollowingInfo(i);
  //     })
  // }, [socket]);

//   useEffect(() => {
//     const getUser = async () => {
//       try {
//         const res = await axios.get(`/users/find/${currentUser?._id}`);
//         setCurrentUserDetails(res.data);
//       } catch(err) {
//         console.log(err);
//       }
//     };
//     if (currentUser) {
//       getUser();
//     }
// }, [currentUser, accountOwner]);

// useEffect(() => {
//   const getUser = async () => {
//     try {
//       const res = await axios.get(`/users/find/${accountOwner?._id}`);
//       setAccountUserDetails(res.data);
//     } catch(err) {
//       console.log(err);
//     }
//   };
//   getUser();
// }, [unfollowingInfo]);


  // const handleFollowing = () => {
  //   const text = "64ce649d7bb93f162782388b";
  //   console.log("before following");
  //   socket?.emit("following", text);
  // }; 

  // useEffect(() => {
  //   console.log("before getText");
  //   socket?.on("getText", (res) => {
  //     setTexts((prev) => [...prev, res]);
  //   });
  // }, [socket, text]);

  return <ChatContext.Provider value={{
      userChats,
      isUserChatsLoading,
      userChatsError,
      potentialChats,
      createChat,
      updateCurrentChat,
      messages,
      isMessagesLoading,
      messagesError,
      currentChat,
      sendTextMessage,
      onlineUsers,
      notifications,
      allUsers,
      markAllNotificationsAsRead,
      markNotificationAsRead,
      markThisUserNotificationAsRead,
      newMessage,
      handleFollowing,
      handleUnfollowing,
      followingInfo,
      unfollowingInfo,
      currentUserDetails,
      accountUserDetails,
      accountOwner
  }}>{children}</ChatContext.Provider>
}