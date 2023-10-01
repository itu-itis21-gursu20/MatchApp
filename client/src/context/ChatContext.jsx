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
  //const [images, setImages] = useState([]);
  const [imagesList, setImagesList] = useState([]);
  const [userList, setUserList] = useState([]);
  //const [displayedImages, setDisplayedImages] = useState([]);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [activeTab, setActiveTab] = useState('Users');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this value
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [initialImages, setInitialImages] = useState([]);

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
        //console.log("resCur", resCur.data);
        setCurrentUserDetails(resCur.data);
        // const resAcc = await axios.get(`/users/find/${id}`);
        const resAcc = await publicRequest.get(`/users/find/${id}`);
        //console.log("resAcc", resAcc.data);
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
// const fetchImages = async (updatedImage) => {
//   try {
//     console.log("fetching images...");
//     const response = await userRequest.get(`images/random/${currentUser?._id}`); 
//     const fetchedImages = response.data;
//     console.log("fetched images", fetchedImages);
//     setImages(fetchedImages);
//     console.log("fetched images[0], fetched images[1]", fetchedImages[0], fetchedImages[1]);
//     console.log("updated image in fetch images", updatedImage);
//     if(updatedImage) {
//       setDisplayedImages([updatedImage, fetchedImages[1]]);
//     } else {
//       setDisplayedImages([fetchedImages[0], fetchedImages[1]]);
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   }
// };

//   const handleImageClick = async (selectedImage) => {

//     console.log("select click");
//     setSelectedImageId(selectedImage._id);
    
//     if(selectedImage){
//     // Increment the point count of the selected image.
//     const updatedImages = images.map(image => { // seçilenin puanının eklendiği array
//       if (image._id === selectedImage._id) {
//         return { ...image, point: image.point + 1 };
//       }
//       return image;
//     });

//     const updatedImage = updatedImages.find(image => image._id === selectedImage._id); // seçilmiş olan imagetır yeni puanlı olandır
//     console.log("updatedImage: " , updatedImage);
//     try {
//           const response = await userRequest.get(`images/point/${selectedImage._id}`); // dbde puanı artırır
//           const obj = {
//             image: response.data
//           };
//           socket?.emit("selectedImageUpdate", obj);

//       const unselectedIndex = displayedImages.findIndex(image => image._id !== selectedImage._id); // seçilmeyenin indexini bulduk
//       const selectedIndex = displayedImages.findIndex(image => image._id === selectedImage._id); // seçilmeyenin indexini bulduk
//       const unselectedImage = displayedImages[unselectedIndex]; // seçilmeyeni bulduk

//       const newUpdatedImages = updatedImages.filter(image => image._id !== unselectedImage._id); // seçilmeyenin silindiği yeni array

//       const newImageToShow = newUpdatedImages.find(image => image._id !== updatedImage._id); // yeni arraydeki seçilen çıkarılır ve kalanlar arasından bir image gösterilir

//       let newDisplayedImages;

//           console.log("new imageToShow", newImageToShow);
//       if (!newImageToShow) { // yeni gösterilecek bir resim yoksa
//         console.log("FFFFFFFFFetching new images...");
//         await fetchImages(updatedImage); // aynı resimleri yeniden alırız
//         console.log("UUUUUUUUUUUupdatedImage", updatedImage);
//         console.log("DDDDDDDDDDDDDDDdisplayedImages", displayedImages);
//         const newImage = displayedImages.find(image => image._id !== updatedImage._id); 
//         console.log("NNNNNNNNNew Image to Show:", newImage);
        
//         if (newImage) {
//             if (selectedIndex === 0) {
//               console.log("selected 0 no image");
//                 newDisplayedImages = [updatedImage, newImage];
//             } else {
//               console.log("selected 1 no image");
//               newDisplayedImages = [newImage, updatedImage];
//             }
//         } else {
//             console.error("No new image found after fetching.");
//         }
//     } else {
//       if(selectedIndex === 0){
//         console.log("selected 0 yes image");
//         newDisplayedImages = [updatedImage, newImageToShow];
//       } else{
//         console.log("selected 1 yes image");
//         newDisplayedImages = [newImageToShow, updatedImage];
//       }
//     }
  
//       setImages(newUpdatedImages);
//       setDisplayedImages(newDisplayedImages);

//     } catch (error) {
//       console.error('Error:', error);
//     }
//   }
//   };



  // useEffect(() => {
  //   fetchImages();
  // }, []); 

  useEffect(() => {
    socket?.on("update", (obj) => {
      console.log("obj in chat context", obj);
      setUpdateInfo(obj);
    })
}, [socket]);

  const [images, setImages] = useState([]);
  const [displayedImages, setDisplayedImages] = useState([]);
  const [pointer, setPointer] = useState(2);  // Keep track of where we are in the images array

// useEffect(() => { //already commented
//   setImages(images);
// },[images]);

// useEffect(() => { //already commented
//   setDisplayedImages(displayedImages);
// },[displayedImages]);






  const fetchImages = async (id) => {
    // Fetch all your images from the database
    console.log("id", id);
    const fetchedImages = await userRequest.get(`images/random/${id}`);
    console.log("fetched images", fetchedImages)
    setImages(fetchedImages.data);
    setDisplayedImages([fetchedImages.data[0], fetchedImages.data[1]]);
  };

  const handleImageClick = async (selectedImage) => {
    
    // Increment point of the selected image
    const updatedImages = images.map(image => 
      image._id === selectedImage._id ? {...image, point: image.point + 1} : image
    );

    // Update the point in the DB
    const response = await userRequest.get(`images/point/${selectedImage._id}`);
    const obj = {
      image: response.data
    };
    socket?.emit("selectedImageUpdate", obj);

    setImages(updatedImages);
    
    // Get the updated image object
    const updatedSelectedImage = updatedImages.find(img => img._id === selectedImage._id);
    
    const selectedIndex = displayedImages.findIndex(img => img._id === selectedImage._id);

    // Filter out the selected image from the updatedImages list
    const imagesToChooseFrom = updatedImages.filter(img => img._id !== updatedSelectedImage._id && !displayedImages.includes(img));

    // Get a random pointer from the filtered list
    const randomPointer = Math.floor(Math.random() * imagesToChooseFrom.length);
    console.log("randomPointer", randomPointer);

    // Set the displayed images based on which image was selected
    console.log("imagesToChooseFrom", imagesToChooseFrom);
    if (selectedIndex === 0) {
      setDisplayedImages([updatedSelectedImage, imagesToChooseFrom[randomPointer]]);
    } else {
      setDisplayedImages([imagesToChooseFrom[randomPointer], updatedSelectedImage]);
    }

    // if (pointer === images.length - 1) {
    //   setPointer(0);  // Reset pointer
    // } else {
    //   setPointer(prev => prev + 1);
    // }
  };


  useEffect(() => {
    const fetchData = async () => {
      const offset = (currentPage - 1) * itemsPerPage;
      if(activeTab === "Photos") {
        try {
          const res = await userRequest.get(`/images/find?sort=${sortOrder}&limit=${itemsPerPage}&offset=${offset}`);
          //console.log("res.data in chat context", res.data);
          setImagesList(res.data);
        } catch (err) {
          console.log(err);
        } 
      } else if(activeTab === "Users") {
        try {
          const res = await userRequest.get(`/users/?sort=${sortOrder}&limit=${itemsPerPage}&offset=${offset}`);
          //console.log("res.data in chat context", res.data);
          setUserList(res.data);
        } catch (err) {
          console.log(err);
        } 
      }
      try {
        const res = await userRequest.get(`/users/find/${id}`);
          console.log("res.data", res.data);
          setUpdatedUser(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [updateInfo, sortOrder, activeTab, currentPage]);

  const [updatedUser, setUpdatedUser] = useState(null);

  // useState(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const res = await userRequest.get(`/users/find/${id}`);
  //       console.log("res.data", res.data);
  //       setUpdatedUser(res.data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchUser();
  // }, [updateInfo])





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
      setDisplayedImages,
      images,
      imagesList,
      userList,
      sortOrder,
      setSortOrder,
      activeTab, 
      setActiveTab,
      currentPage, 
      setCurrentPage,
      selectedImageId,
      fetchImages,
      updateInfo,
      updatedUser,
      socket
  }}>{children}</ChatContext.Provider>
}


// const handleImageClick = async (selectedImage) => {
  
//   const updatedImages = images.map(image => 
//     image._id === selectedImage._id ? {...image, point: image.point + 1} : image
//   );

//   const response = await userRequest.get(`images/point/${selectedImage._id}`); // update point in DB
//   const obj = {
//     image: response.data
//   };
//   socket?.emit("selectedImageUpdate", obj);

//   setImages(updatedImages);
  
//   const updatedSelectedImage = updatedImages.find(img => img._id === selectedImage._id); // get the updated image object
  
//   const selectedIndex = displayedImages.findIndex(img => img._id === selectedImage._id);

//   if (pointer === images.length - 1) {
//     setPointer(0);  // Reset pointer
//   } else {
//     setPointer(prev => prev + 1)
//   }

//   console.log("updatedImages", updatedImages);
//   if (selectedIndex === 0) {
//     console.log("pointer", pointer);

//     if(updatedSelectedImage._id !== updatedImages[pointer]._id){ // seçilen ve bir sonra gelecek olan eşit değilse
//       setDisplayedImages([updatedSelectedImage, updatedImages[pointer]]); // normal olarak göster
//     } else { // eşitse
//       setDisplayedImages([updatedSelectedImage, updatedImages[pointer + 1]]); // bir sonrakini göster
//     }
//   } 

//   else {
//     console.log("pointer", pointer);
//     if(updatedSelectedImage._id !== updatedImages[pointer]._id){
//       setDisplayedImages([updatedImages[pointer], updatedSelectedImage]);
//     } else {
//       setDisplayedImages([updatedImages[pointer + 1], updatedSelectedImage]);
//     }
//   }

//   // if (pointer === images.length - 1) {
//   //   setPointer(0);  // Reset pointer
//   // } else {
//   //   setPointer(prev => prev + 1)
//   // }
  
// };
