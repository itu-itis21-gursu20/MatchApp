import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Messenger from './pages/Messenger/Messenger';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Duel from './pages/Duel';
import UserProfile from './pages/UserProfile';
import { useEffect, useRef, useState } from 'react';
import { logOut } from "./redux/apiCalls";
import jwtDecode from 'jwt-decode';
//import { io } from "socket.io-client" 
//import { SocketProvider } from './context/SocketContext';
//import socket from './socket';
import Berkay from './pages/Berkay';
//import { NotificationProvider } from './context/NotificationContext';
import { ChatContextProvider } from './context/ChatContext';

//const socket = io.connect("ws://localhost:8900");

function App() {

  console.log('App component loaded');
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //const [socket, setSocket] = useState(null);

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

  //const socket = useRef(io("ws://localhost:8900"));

  //const socket = useRef();

  // useEffect(() => {
  //   socket.current = io("ws://localhost:8900");
  //   console.log("Socket inside useEffect:", socket);
  //   return () => {
  //     socket.current.disconnect();
  // };
  // }, []);

  // useEffect(() => {
  //   console.log("addUser");
  //   console.log("userapp", user);
  //   if(user !== null) {
  //     socket?.emit("addUser", user?._id);
  //   }
  // }, [user]);


  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTimestamp = Date.now() / 1000;
  
      return decoded.exp && decoded.exp < currentTimestamp;
    } catch (err) {
      return true;
    }
  }

  useEffect(() => {
    if (user && user.accessToken && isTokenExpired(user.accessToken)) {
      logOut(dispatch);
      navigate("/login");
    }
  }, [user]);

  // useEffect(() => {
  //   if (user && user.accessToken) {
  //     if (isTokenExpired(user.accessToken)) {
  //       logOut(dispatch);
  //       navigate("/login");
  //     } else {
  //       if (!socket) {
  //         const newSocket = io("ws://localhost:8900");
  //         setSocket(newSocket);
  //         newSocket.emit("addUser", user?._id);

  //         return () => newSocket.disconnect(); // Clean up on unmount
  //       }
  //     }
  //   } else if (socket) {
  //     socket.disconnect();
  //     setSocket(null);
  //   }
  // }, [user]);

  //console.log("socket in app", socket);

  return (
    <ChatContextProvider user = {user}>
        <div className="App">
          {/* {socket ? ( */}
              <Routes>
                <Route exact path="/" element={ user ? <Home /> : <Navigate to="/login" />} />
                <Route path="/login" element={ user ? <Navigate to="/" /> : <Login /> } />
                <Route path="/register" element={ user ? <Navigate to="/" /> : <Register /> } />
                <Route path="/messenger" element={ !user ? <Navigate to="/" /> : <Messenger /> } />
                <Route path="/berkay" element={ !user ? <Navigate to="/" /> : <Berkay /> } />
                <Route path="/duel" element={ <Duel />}/>
                <Route path="/users/:id" element={ <UserProfile />}/>
            </Routes>
          {/* ) : <div>Connecting...</div>}  */}
        </div>
    </ChatContextProvider>
  );
}

export default App;

