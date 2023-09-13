import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Main from '../components/Main'
import Features from '../components/Features'
import { useSelector } from 'react-redux'
//import socket from '../socket';

const Home = () => {

  //console.log("socket in home", socket);

  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if(user !== null) {
      //socket.socket.emit("addUser", user?._id); // messengerda ekleme olura burada olmazsa messaging doğru çalışıyor ama profilde notif yok
    }
  }, [user]);

  return (
    <>
    <Navbar />
    <Main />
    <Features />
    <Footer />
    </>
  )
}

export default Home