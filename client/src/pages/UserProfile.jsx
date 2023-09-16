import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Image from "../components/Image";
import Navbar from "../components/UserProfile/Navbar";
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL 
} from "firebase/storage";
import app from "../firebase";
import { Upload } from "../components/Upload";
import Images from "../components/Images";
import { useDispatch, useSelector } from "react-redux";
//import { setAccountOwner } from "../redux/apiCalls";
import { following } from "../redux/userRedux";
import { io } from "socket.io-client";
import { ChatContext } from "../context/ChatContext";
//import socket from '../socket';
//import { SocketContext } from '../context/SocketContext';


// accountownerın bilgileri de anlık güncellenmeli yani bununla ilgili reduxta kod yazılmalı
// dm kutusu düşün
// bildirim kutusu düşün
// foto eklemeyi güzel yap
// following ve followersa basınca hesaplar gözükmeli


export default function UserProfile() {

  //const accountOwner = useSelector(state => state.user.accountOwner);
  //console.log("accountOwner",accountOwner);
  const currentUser = useSelector(state => state.user.currentUser);
  //console.log("currentUser",currentUser);

  const [open, setOpen] = useState(false);
  const [followerDetails, setFollowerDetails] = useState([]);
  const [followingDetails, setFollowingDetails] = useState([]);
  const [data, setData] = useState("");


  const location = useLocation();
  const id = location.pathname.split('/')[2];

  const [followingNotifications, setFollowingNotifications] = useState([]);

  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);

  const [followingNotification, setFollowingNotification] = useState(null);
  const [unfollowingNotification, setUnfollowingNotification] = useState(null);
  

  //const { notifications } = useNotifications();
  //const [socket, setSocket] = useState(null);
  //const socket = useContext(SocketContext);



  //const [accountOwner, setAccountOwner] = useState(null);

  const [isCurrentUser, setIsCurrentUser] = useState(false);

  const [userDetails, setUserDetails] = useState(null);



  useEffect(() => {
    if(id === currentUser?._id) {
      setIsCurrentUser(true);
    } else {
      setIsCurrentUser(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    console.log("isCurrentUser", isCurrentUser);
  }, [isCurrentUser])

  const { notifications, handleFollowing, handleUnfollowing, followingInfo, unfollowingInfo, currentUserDetails, accountUserDetails, accountOwner } = useContext(ChatContext);
  //console.log("notifications first", notifications);

  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const mahmut = user && JSON.parse(user).currentUser;
  const TOKEN = mahmut?.accessToken;
  
  const dispatch = useDispatch();

  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingsModal, setShowFollowingsModal] = useState(false);

  // const [isFollowing, setIsFollowing] = useState(false);

  // useEffect(() => {
  //   if(currentUser.followedUsers.includes(id)){
  //     setIsFollowing(true);
  //     console.log("isFollowing", isFollowing)
  //   } else {
  //     setIsFollowing(false);
  //     console.log("isFollowing", isFollowing)
  //   }
  // }, [id, currentUser]);

  // useEffect(() => {
  //   if(isFollowing){
  //     console.log("following")
  //   } else {
  //     console.log("not following")
  //   }
  // }, [isFollowing])


  //console.log("socket user profile", socket);

  // useEffect(() => {
  //   console.log("getNotificationbesiktas")
  //   socket.socket.on("getNotification", (data) => {
  //     console.log("data in notif",data)
  //     setNotifications((prev) => [...prev, data]);
  //   })
  // }, [socket]);

  // useEffect(() => {
  //   socket.socket.emit("addUser", currentUser?._id);
  // }, [currentUser]);


  // useEffect(() => {
  //   console.log("notifications in notif",notifications);
  // });

  // Handler function to toggle modal visibility
  const toggleFollowersModal = () => {
      setShowFollowersModal(prevState => !prevState);
  };

  // Handler function to toggle modal visibility
  const toggleFollowingsModal = () => {
    setShowFollowingsModal(prevState => !prevState);
  };

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const res = await axios.get(`/users/find/${id}`);
  //       setAccountOwner(res.data);
  //     } catch(err) {
  //       console.log(err);
  //     }
  //   };
  //   getUser();
  // }, [id, followingInfo, unfollowingInfo]);

  // useEffect(() => {
  //   console.log(`${followingInfo?.followerUsername} followed you`);
  // }, [followingInfo]);

  // useEffect(() => {
  //   console.log(`${followingInfo?.followerUsername} unfollowed you`);
  // }, [unfollowingInfo]);




  // useEffect(() => { *********************************
  //   const getUser = async () => {
  //     try {
  //       const res = await axios.get(`/users/find/${currentUser?._id}`);
  //       setUserDetails(res.data);
  //     } catch(err) {
  //       console.log(err);
  //     }
  //   };
  //   if (currentUser) {
  //     getUser()
  //   }
  // }, [currentUser]);

//   useEffect(() => {
//     if(showFollowersModal) {
//         const fetchFollowersDetails = async () => {
//             try {
//                 const response = await axios.get(`/users/findMultiple?ids=${accountOwner.followers.join(",")}`);
//                 setFollowerDetails(response.data);
//             } catch (error) {
//                 console.error("Error fetching follower details:", error);
//             }
//         };

//         fetchFollowersDetails();
//     }
// }, [showFollowersModal, accountOwner?.followers]);

// useEffect(() => {
//     if(showFollowingsModal) {
//         const fetchFollowingsDetails = async () => {
//             try {
//                 const response = await axios.get(`/users/findMultiple?ids=${accountOwner.followedUsers.join(",")}`);
//                 setFollowingDetails(response.data);
//             } catch (error) {
//                 console.error("Error fetching following details:", error);
//             }
//         };

//         fetchFollowingsDetails();
//     }
// }, [showFollowingsModal, accountOwner?.followedUsers]);

// useEffect(() => {
//   console.log("notifications coming", notifications);
// });


  // const handleFollowing = async () => {

  //   console.log("handleFollowing");

  //   if(currentUser.followedUsers.includes(id)){ // zaten takip ediyorsa
  //   await axios.put(`/users/unfollow/${id}`, {}, {
  //     headers: {
  //       token: `Bearer ${TOKEN}`
  //     }
  //   })
  //   //setFollowingCount(prev => prev - 1);
  // }
  //   else { // zaten takip etmiyorsa
  //     await axios.put(`/users/follow/${id}`, {}, {
  //     headers: {
  //       token: `Bearer ${TOKEN}`
  //     }
  //   })
  //   //setFollowingCount(prev => prev + 1);
  // }
  
  //   //console.log("before setConsole");
  //   dispatch(following({id: id, currentUserId: currentUser._id}));

  //   //console.log("current emit update following");
  //   //socket.emit('followUser', { id: id, currentUserId: currentUser._id });
  // }

  // useEffect(() => {
  //   const newSocket = io("http://localhost:8900");
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.disconnect();
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (socket === null) return;
  //   socket.emit("addNewUser", user?._id);
  // }, [socket]);


//******************************** */
  // useEffect(() => {
  //   socket?.on("getNotification", (res) => {
  //     console.log("res user profile", res);
  //   });
  // }, [socket]);
  //************************************ */



//   useEffect(() => {
//     // When the updateFollowing event is received, update the Redux state

//     console.log("current on update following");
//     socket.current?.on('muzaffer', () => {
//       setFollowerCount(prev => prev + 1)
//     }
//     );

//     // Cleanup: remove the listener when the component is unmounted
//     return () => {
//         socket.current?.off('updateFollowing');
//     };
// }, []);
      //const text = "hello, i came from client";
    //socket.current?.emit("hello", text)




  // useEffect(() => {
  //   socket.current?.on("hi", response => {
  //     console.log("response came from server and now i am on client",response);
  //   })
  // }, []);

  // useEffect(() => {

  //   socket.on("getReceiver", (data) => { // datada furkanın idsi
  //     console.log("getReceiver");
  //     console.log("senderId", data);
  //     setData(data);
  //     setConsoleText((prev) => [...prev, data]);
  //     //console.log("before followingAboutReceiver")
  //     //dispatch(followingAboutReceiver({id: id, currentUserId: currentUser._id}));

  //   });

  //   socket.on("getSender", (data) => { // datada furkanın idsi
  //     console.log("getSender");
  //     console.log("receiverId", data);
  //     setConsoleText((prev) => [...prev, data]);
  //     //console.log("before followingAboutSender");
  //     //dispatch(followingAboutSender({id: id, currentUserId: currentUser._id}));
  //   });
    
  // }, [socket]);

    //dispatch(following({id: id, currentUserId: currentUser._id}));

 // console.log("consoleText", consoleText);


  const displayNotification = ({ senderName, text }) => {
    return (
      <span>{ `${senderName} sent a message: ${text} `}</span>
    )
  }


  // const displayFollowingText = (followingInfo) => {
  //   return (
  //     <span>{ `${followingInfo?.followerUsername} followed you `}</span>
  //   )
  // }
  // const displayUnfollowingText = (unfollowingInfo) => {
  //   return (
  //     <span>{ `${unfollowingInfo?.unfollowerUsername} unfollowed you `}</span>
  //   )
  // }

  // const displayFollowingText = (followingInfo) => {
  //   setFollowingNotification(<span>{ `${followingInfo?.followerUsername} followed you `}</span>);
  // }
  
  // const displayUnfollowingText = (unfollowingInfo) => {
  //     setUnfollowingNotification(<span>{ `${unfollowingInfo?.unfollowerUsername} unfollowed you `}</span>);
  // }

  const displayFollowingText = (followingInfo) => {
    const notification = <span key={Date.now()}>{`${followingInfo?.followerUsername} followed you `}</span>;
    console.log("folnot");
    setFollowingNotifications(prev => [...prev, notification]);
}
  
const displayUnfollowingText = (unfollowingInfo) => {
    const notification = <span key={Date.now()}>{`${unfollowingInfo?.unfollowerUsername} unfollowed you `}</span>;
    console.log("unfolnot");
    setFollowingNotifications(prev => [...prev, notification]);
}



  useEffect(() => {
    console.log("followingInfo", followingInfo);
    console.log("currentUser._id", currentUser?._id);
    console.log("follow cond", currentUser?._id !== followingInfo?.followerId);
    if (followingInfo && currentUser?._id !== followingInfo?.followerId) {  // Checking if followingInfo is not null/undefined
      console.log("following notif showed")
        displayFollowingText(followingInfo);
    }
}, [followingInfo]);  

  useEffect(() => {
    console.log("unfollowingInfo", unfollowingInfo);
    console.log("currentUser._id", currentUser?._id);
    console.log("unfollow cond", currentUser?._id !== unfollowingInfo?.unfollowerId);
    if (unfollowingInfo && currentUser?._id !== unfollowingInfo?.unfollowerId) {  // Checking if followingInfo is not null/undefined
      console.log("unfollowing notif showed")
        displayUnfollowingText(unfollowingInfo);
    }
}, [unfollowingInfo]);  

  console.log("accountUserDetails", accountUserDetails);

  return (
    <>

      <Navbar transparent />
      <main className="profile-page">
        <section className="relative block" style={{ height: "500px" }}>
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')"
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
          <div
            className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
            style={{ height: "70px" }}
          >
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-gray-300 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-gray-300">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <img
                        alt="..."
                        src={currentUser?._id === id ? currentUserDetails?.profileImg : accountUserDetails?.profileImg}
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                        style={{ maxWidth: "150px" }}
                      />
                    </div>
                  </div>
                  <div className="w-full flex justify-around lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                  <div>Total Point: {currentUser?._id === id ? currentUserDetails?.totalPoint : accountUserDetails?.totalPoint}</div>
                  {
                      currentUser._id !== id && 
                        ( currentUser.followedUsers.includes(id)
                          ? <button onClick={() => handleUnfollowing(currentUser, id)} type="button" class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">UNFOLLOW</button>
                          : <button onClick={() => handleFollowing(currentUser, id)} type="button" class="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">FOLLOW</button>
                        )
                  }
                    <button className="">
                      <div onClick={() => setOpen(true)}>Add</div>
                      { open && <Upload setOpen={setOpen}/> }
                    </button>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3 text-center">
                        <span className="text-xl font-bold block uppercase tracking-wide text-gray-700">             
                        {currentUser?._id === id ? currentUserDetails?.imageNumber : accountUserDetails?.imageNumber}
                        </span>
                        <span className="text-sm text-gray-500">Photos</span>
                      </div>


                      <div className="mr-4 p-3 text-center cursor-pointer">
                        <span 
                          className="text-xl font-bold block uppercase tracking-wide text-gray-700"
                          onClick={toggleFollowersModal}
                        >
                          {currentUser?._id === id ? currentUserDetails?.followers?.length : accountUserDetails?.followers?.length}
                        </span>
                        <span className="text-sm text-gray-500">Followers</span>
                      </div>

                      {/* Followers Modal */}
                      {showFollowersModal && (
                          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                              <div className="bg-white p-4 rounded">
                                  <h3 className="mb-4">Followers</h3>
                                  <ul>
                                      {followerDetails.map(follower => (
                                        <a href={`/users/${follower._id}`} target="_blank" rel="noopener noreferrer">
                                          <li key={follower._id} className="flex items-center">
                                              <img className="mr-2" width={50} height={50} src={follower.profileImg} alt={follower.username} />
                                              <span>{follower.username}</span>
                                          </li>
                                        </a>
                                      ))}
                                  </ul>
                                  <button onClick={toggleFollowersModal}>Close</button>
                              </div>
                          </div>
                      )}
                      {/* { isFollowing ? <span>Following</span> : <span>Not Following</span>} */}
                      <div className="lg:mr-4 p-3 text-center cursor-pointer">
                        <span 
                          className="text-xl font-bold block uppercase tracking-wide text-gray-700"
                          onClick={toggleFollowingsModal}
                        >
                          {currentUser?._id === id ? currentUserDetails?.followedUsers?.length : accountUserDetails?.followedUsers?.length}
                        </span>
                        <span className="text-sm text-gray-500">Followings</span>
                      </div>

                      {/* Followings Modal */}
                      {showFollowingsModal && (
                          <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
                              <div className="bg-white p-4 rounded">
                                  <h3 className="mb-4">Followings</h3>
                                  <ul>
                                      {followingDetails.map(following => (
                                        <a href={`/users/${following._id}`} target="_blank" rel="noopener noreferrer">
                                          <li key={following._id} className="flex items-center">
                                              <img className="mr-2" width={50} height={50} src={following.profileImg} alt={following.username} />
                                              <span>{following.username}</span>
                                          </li>
                                        </a>
                                      ))}
                                  </ul>
                                  <button onClick={toggleFollowingsModal}>Close</button>
                              </div>
                          </div>
                      )}


                  <div className="div">Account Owner = {accountUserDetails?.username}</div> <br />
                  <div className="div">Current User = {currentUserDetails?.username}</div>

                    </div>
                  </div>
                </div>
                <div className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal text-gray-800 mb-2">
                  { currentUser?._id === id ? currentUserDetails?.username : accountUserDetails?.username }
                  
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                    <i className="fas fa-map-marker-alt mr-2 text-lg text-gray-500"></i>{" "}
                    Los Angeles, California
                  </div>
                  <a href={"/messenger"} target="_blank" rel="noopener noreferrer">MESSAGING</a>
                  <a href="http://localhost:3000/users/64d3f154295fbbba976570de">Go to Furkan</a>
                    <a href="http://localhost:3000/users/64ce649d7bb93f162782388b">Go to Berkay</a>

                  <div className="mb-2 text-gray-700 mt-10">
                    <i className="fas fa-briefcase mr-2 text-lg text-gray-500"></i>
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div className="mb-2 text-gray-700">
                    <i className="fas fa-university mr-2 text-lg text-gray-500"></i>
                    University of Computer Science
                  </div>
                  <div>
                    <div>Notifications = </div>
                    {notifications.map((n) => displayNotification(n))}
                  </div>
                  {notifications.length}
                  {/* <div>
                    {followingNotification}
                    {unfollowingNotification}
                 </div> */}
                 <div>
                    {followingNotifications.map(notification => notification)}
                    {/* Rest of your component */}
                </div>
                
                </div>
               
                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full lg:w-9/12 px-4">
                     <div className="grid grid-cols-3">
                      <Images userId={id}/>
                     </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <Footer /> */}
    </>
  );
}