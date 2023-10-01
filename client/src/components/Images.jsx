// import React, { useContext, useEffect, useState } from 'react'
// import Image from './Image';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { userRequest } from '../requestMethods'
// import { ChatContext } from '../context/ChatContext';

// const Images = ({ userId }) => {

//    // const { currentUser } = useSelector( (state) => state.user );

//     const [images, setImages] = useState([]);

//     const { socket } = useContext(ChatContext);

//     const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
//     const currentUser = user && JSON.parse(user).currentUser;
//     const TOKEN = currentUser?.accessToken;
  
//     const [msg, setMsg] = useState(null);

//   useEffect(() => {
//     socket?.on("gursu", (msg) => {
//       console.log("msg2", msg);
//       setMsg(msg);

//     });
//   }, [socket]);

//     useEffect( () => {
//       const fetchImages = async () => {
//         try {
//           // const res = await axios.get(`/images/find/berkay/${userId}`, 
//           // {
//           //   headers: {
//           //     token: `Bearer ${TOKEN}`
//           //   } 
//           // });
//           const res = await userRequest.get(`/images/find/berkay/${userId}`);
//           console.log("images res data", res.data);
//           setImages(res.data);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//       fetchImages();
//     }, [userId, msg])

//   return (
//     <>
//       { images.map(image => (
//         <Image key={image._id} image={image}/>
//       ))}
//     </>
//   )
// } 

// export default Images