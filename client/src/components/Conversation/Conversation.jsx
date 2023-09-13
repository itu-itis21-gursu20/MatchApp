import React, { useContext, useEffect, useState } from 'react'
import "./conversation.css";
import axios from 'axios';
import { ChatContext } from '../../context/ChatContext';
import moment, * as moments from 'moment';

const Conversation = ({ conversation, currentUser }) => {

  //router.get("/find/:id", getUser);
  const [user, setUser] = useState(null);
  //console.log("conversation", conversation);
  const { onlineUsers, notifications, markThisUserNotificationAsRead, newMessage } = useContext(ChatContext);
  
  const [latestMessage, setLatestMessage] = useState(null);

  
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    
    const getUser = async () => {
      try {
        const res = await axios.get(`/users/find/${friendId}`);
        setUser(res.data);
      } catch (e) {
        console.log(e);
      }
    }
    getUser();
  }, [currentUser, conversation]);

  useEffect(() => {
    const getMessages = async () => {
      try {
          const res = await axios.get("/messages/" + conversation?._id); // all messages of that conversation come here
          const lastMessage = res.data[res.data.length - 1];
          setLatestMessage(lastMessage);
      } catch (err) {
          console.log(err);
      }
    };
    getMessages();
  }, [newMessage, notifications]);


  const unreadNotifications = notifications.filter((n) => n.isRead === false);
  const thisUserNotifications = unreadNotifications?.filter((n) => n.senderId === user?._id);

  
  const isOnline = onlineUsers?.some((onlineUser) => onlineUser?.userId === user?._id);

  const truncateText = (text) => {
    let shortText = text.substring(0, 20);

    if(text.length > 20) {
      shortText = shortText + "...";
    }

    return shortText;
  } 





  return (
    <div className='conversation' onClick={() => {
      if(thisUserNotifications.length !== 0) {
        markThisUserNotificationAsRead(thisUserNotifications, notifications);
      }
    }}>
        <div className='flex'>
          <img className='conversationImg' src={user?.profileImg} alt="" />
          <div>
            <div className='conversationName'>{user?.username}</div>
            <div>{
              latestMessage?.text && (
                <span>{truncateText(latestMessage?.text)}</span>
              )
            }</div>
          </div>
        </div>
        <div className='flex flex-col items-end'>
          <div className={isOnline ? "online" : ""}></div>
          <div>{moment(latestMessage?.createdAt).calendar()}</div>
          <div className={ thisUserNotifications.length > 0 ? "notification": ""}>
            { thisUserNotifications.length > 0 ? thisUserNotifications.length : ""}
          </div>  
        </div>
    </div>
  )
}

export default Conversation