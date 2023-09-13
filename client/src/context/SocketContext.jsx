// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { io } from "socket.io-client" 

// export const SocketContext = createContext();

// export const SocketProvider = ({ children, user }) => {

//     const [socket, setSocket] = useState(null);

//     useEffect(() => {
//         const newSocket = io("http://localhost:8900");
//         setSocket(newSocket);
    
//         return () => {
//           newSocket.disconnect();
//         }
//       }, []);
    
//       useEffect(() => {
//         if (socket === null) return;
//         socket.emit("addNewUser", user?._id);
//       }, [socket]);

//       console.log("socket in context", socket);
//     return (
//         <SocketContext.Provider value={{ 
//           socket 
//           }}>
//             {children}
//         </SocketContext.Provider>
//     );
// };
