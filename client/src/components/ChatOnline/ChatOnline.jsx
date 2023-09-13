// import React, { useEffect, useState } from 'react'
// import "./chatOnline.css";
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// const ChatOnline = ({onlineUsers, currentId, setCurrentChat}) => {


//   const [followers, setFollowers] = useState([]);
//   const [followings, setFollowings] = useState([]);
//   const [friends, setFriends] = useState([]); // hem follower hem de followingte olan artık friend olur
//   const [onlineFriends, setOnlineFriends] = useState([]);

//   const user = useSelector(state => state.user.currentUser);


//   useEffect( () => {
//     console.log("user.followedUsers.length", user.followedUsers.length);
//     console.log("user.followers.length",user.followers.length);
//     if(user.followedUsers.length !== 0, user.followers.length !== 0) {

//       const fetchFollowingsDetails = async () => {
//         try {
//             const followedUsers = await axios.get(`/users/findMultiple?ids=${user.followedUsers.join(",")}`);
//             setFollowings(followedUsers.data);
//            console.log("followings", followedUsers.data);
          
//         } catch (error) {
//             console.error("Error fetching following details:", error);
//         }
//       }
//       fetchFollowingsDetails();


//       const fetchFollowersDetails = async () => {
//         try {
//             const followers = await axios.get(`/users/findMultiple?ids=${user.followers.join(",")}`);
//             setFollowers(followers.data);
//             console.log("followers", followers.data);
          
//         } catch (error) {
//             console.error("Error fetching following details:", error);
//         }
//       }
//       fetchFollowersDetails();

//     }
//   }, [user.followedUsers, user.followers]);

//   useEffect(() => {
//     if(followings.length > 0 && followers.length > 0) {
//       const set1 = new Set(followings.map(f => f.id)); // Assuming id is the unique field
//       const commonElements = followers.filter(element => set1.has(element.id));
//       console.log("commonElements", commonElements);
//       setFriends(commonElements);
//     }
// }, [followings, followers]);

// useEffect(() => {
//   console.log("onlineUsers",onlineUsers);
//   console.log("friends",friends)
//   const onlineUserIds = onlineUsers.map(user => user.userId);
//   setOnlineFriends(friends.filter((f) => onlineUserIds.includes(f._id)));
//   console.log("onlineFriends",onlineFriends);
// }, [friends, onlineUsers]);


//   return (
//     <div className="chatOnline">
//       { onlineFriends.map((o) => (
//         <div className="chatOnlineFriend">
//           <div className="chatOnlineImgContainer">
//             <img
//               className="chatOnlineImg"
//               src={o?.profileImg}
//               alt=""
//               />
//             <div className="chatOnlineBadge"></div>
//           </div>
//           <span className="chatOnlineName">{o?.username}</span>
//         </div>
//       ))}
//     </div>
//   )
// }

// export default ChatOnline

// // const fetchFollowingsDetails = async () => {
// //   try {
// //       const response = await axios.get(`/users/findMultiple?ids=${accountOwner.followedUsers.join(",")}`);
// //       setFollowingDetails(response.data);
// //   } catch (error) {
// //       console.error("Error fetching following details:", error);
// //   }
// // };