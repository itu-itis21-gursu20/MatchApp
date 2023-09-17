import axios from 'axios';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { following, unfollowing } from "../redux/userRedux";
import { useLocation } from 'react-router-dom';
import { publicRequest, userRequest } from '../requestMethods';

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
  const [images, setImages] = useState([]);
  const [imagesList, setImagesList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('Photos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this value
  const [selectedImageId, setSelectedImageId] = useState(null);

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
        //const res = await axios.get(`/users/find/${id}`);
        const res = await publicRequest.get(`/users/find/${id}`);
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
          //const res = await axios.get("/users");
          const res = await publicRequest.get("/users");
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
      //const res = await axios.post("/conversations", { senderId: user._id, receiverId });
      const res = await publicRequest.post("/conversations", { senderId: user._id, receiverId });
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
              //const res = await axios.get("/conversations/" + user?._id);
              const res = await publicRequest.get("/conversations/" + user?._id);
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
            // const res = await axios.get("/messages/" + currentChat?._id);
            const res = await publicRequest.get("/messages/" + currentChat?._id);
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
        // const res = await axios.post("/messages", 
        // {
        //     conversationId: currentChatId,
        //     sender: sender._id,
        //     senderName: sender.username,
        //     text: textMessage,
        // })
        const res = await publicRequest.post("/messages", 
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
        // const resCur = await axios.get(`/users/find/${currentUser?._id}`);
        const resCur = await publicRequest.get(`/users/find/${currentUser?._id}`);
        console.log("resCur", resCur.data);
        setCurrentUserDetails(resCur.data);
        // const resAcc = await axios.get(`/users/find/${id}`);
        const resAcc = await publicRequest.get(`/users/find/${id}`);
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
        // const res = await axios.get(`/users/find/${id}`);
        const res = await publicRequest.get(`/users/find/${id}`);
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

    socket?.emit("unfollow", { unfollowerUsername: currentUser?.username, unfollowerId: currentUser?._id, unfollowedId: id });

    setRefresh(prev => !prev); 

  }, [socket, id]);


//------------------------------------------------------------------------------------------------
  const handleImageClick = async (selectedImage) => {
    console.log("select click");
    setSelectedImageId(selectedImage._id);
    
    if(selectedImage){
    // Increment the point count of the selected image.
    const updatedImages = images.map(image => { // seçilenin puanının eklendiği array
      if (image._id === selectedImage._id) {
        return { ...image, point: image.point + 1 };
      }
      return image;
    });

    const updatedImage = updatedImages.find(image => image._id === selectedImage._id); // bir öncekinde seçilendir

    try {

          const response = await userRequest.get(`images/point/${selectedImage._id}`);
          const obj = {
            image: response.data
          };
          socket?.emit("selectedImageUpdate", obj);

      // Find the index of the unselected image and remove it from the list.
      const unselectedIndex = displayedImages.findIndex(image => image._id !== selectedImage._id); // seçilmeyenin indexini bulduk
      const selectedIndex = displayedImages.findIndex(image => image._id === selectedImage._id); // seçilmeyenin indexini bulduk
      const unselectedImage = displayedImages[unselectedIndex]; // seçilmeyeni bulduk

      // const newUpdatedImages = updatedImages.filter(image => image._id !== selectedImage._id && image._id !== unselectedImage._id);

      // const newDisplayedImages = [
      //   updatedImage, // seçilen ve puanı güncellenen
      //   newUpdatedImages.find(image => !displayedImages.includes(image))
      // ];

      const newUpdatedImages = updatedImages.filter(image => image._id !== unselectedImage._id);

      const newImageToShow = newUpdatedImages.find(image => image._id !== updatedImage._id);

      //const newDisplayedImages = [updatedImage, newImageToShow];
      let newDisplayedImages;

      if (!newImageToShow) {
          // If there's no new image left, display only the last selected image
          newDisplayedImages = [updatedImage];
      } else {
        if(selectedIndex === 0){
          newDisplayedImages = [updatedImage, newImageToShow];
        } else{
          newDisplayedImages = [newImageToShow, updatedImage];
        }
      }

      setImages(newUpdatedImages);
      setDisplayedImages(newDisplayedImages);

    } catch (error) {
      console.error('Error:', error);
    }
  }
  };

  useEffect(() => {
    setImages(images);
  },[images]);

  useEffect(() => {
    setDisplayedImages(displayedImages);
  },[displayedImages]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await userRequest.get(`images/random/${currentUser?._id}`); 

        const fetchedImages = response.data;
        setImages(fetchedImages);
        setDisplayedImages([fetchedImages[0], fetchedImages[1]]);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchImages();
  }, []); 

  useEffect(() => {
    socket?.on("update", (obj) => {
      console.log("obj in chat context", obj);
      setUpdateInfo(obj);
    })
}, [socket]);

  useEffect(() => {
    const fetchData = async () => {
      const offset = (currentPage - 1) * itemsPerPage;
      console.log("tab active", activeTab);
      if(activeTab === "Photos") {
        try {
          const res = await userRequest.get(`/images/find?sort=${sortOrder}&limit=${itemsPerPage}&offset=${offset}`);
          console.log("res.data in chat context", res.data);
          setImagesList(res.data);
        } catch (err) {
          console.log(err);
        } 
      } else if(activeTab === "Users") {
        try {
          const res = await userRequest.get(`/users/?sort=${sortOrder}&limit=${itemsPerPage}&offset=${offset}`);
          console.log("res.data in chat context", res.data);
          setUserList(res.data);
        } catch (err) {
          console.log(err);
        } 
      }
    }
    fetchData();
  }, [updateInfo, sortOrder, activeTab, currentPage]);






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
      accountOwner,
      handleImageClick,
      displayedImages,
      images,
      imagesList,
      userList,
      sortOrder,
      setSortOrder,
      activeTab, 
      setActiveTab,
      currentPage, 
      setCurrentPage,
      selectedImageId
  }}>{children}</ChatContext.Provider>
}