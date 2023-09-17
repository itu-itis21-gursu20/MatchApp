import "./messenger.css";
//import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/Conversation/Conversation";
import Message from "../../components/Message/Message";
//import ChatOnline from "../../components/ChatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import  Navbar from "../../components/UserProfile/Navbar";
//import socket from '../../socket';
//import { useNotifications } from '../../context/SocketContext';
import { ChatContext } from "../../context/ChatContext";
import InputEmoji from "react-input-emoji";
import MailIcon from '@mui/icons-material/Mail';
// import { format } from "timeago.js"
// import { moment } from "moment";
import moment, * as moments from 'moment';
import { publicRequest } from "../../requestMethods";

export default function Messenger() {

  const {  
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
    newMessage
  } = useContext(ChatContext);

  console.log("User Chats", userChats);
  console.log("Potential Chats", potentialChats);
  
  const [conversations, setConversations] = useState([]);
  //const [currentChat, setCurrentChat] = useState(null);
  //const [messages, setMessages] = useState([]);
  //const [newMessage, setNewMessage] = useState("");
  const [textMessage, setTextMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  //const [onlineUsers, setOnlineUsers] = useState([]);
  //const [notifications, setNotifications] = useState([]);
  //const { setNotifications } = useNotifications();
  //const [allUsers, setAllUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sortedChats, setSortedChats] = useState([]); 

  //const socket = useRef();
  const scrollRef = useRef();

  const user = useSelector(state => state.user.currentUser);

  const mahmut = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUser = mahmut && JSON.parse(mahmut).currentUser;
  const TOKEN = currentUser?.accessToken;

  console.log("notifications in messenger", notifications);

  const unreadNotifications = notifications.filter((n) => n.isRead === false);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.username //??
    }
  });

  console.log("un", unreadNotifications);
  console.log("mn", modifiedNotifications);








  //console.log("socket in messenger", socket);
  
  //console.log('Messenger component loaded');

  // useEffect(() => {
  //   console.log("getNotificationbesiktas")
  //   socket.socket.on("getNotification", (data) => {
  //     console.log("data in notif",data)
  //     setNotifications((prev) => [...prev, data]);
  //   })
  // }, [socket]);
  
  // //socket.current = io("ws://localhost:8900");
  // useEffect(() => {

  //   socket.socket.on("getMessage", (data) => {
  //     console.log("getMessage");
  //     console.log("data", data);
  //     setArrivalMessage({
  //       sender: data.senderId,
  //       text: data.text,
  //       createdAt: Date.now(),
  //     });
  //   });
  // }, []);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     try {
  //       const res = await axios.get("/users", 
  //       {
  //         headers: {
  //           token: `Bearer ${TOKEN}`
  //         }
  //       });
  //       console.log("res.data", res.data);
  //       setAllUsers(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchUsers();
  // }, [])

  // useEffect(() => {
  //   console.log("arrivalMessage");
  //   arrivalMessage &&
  //     currentChat?.members.includes(arrivalMessage.sender) &&
  //     setMessages((prev) => [...prev, arrivalMessage]);
  //     setNotifications(prev => [...prev, arrivalMessage]);
  // }, [arrivalMessage, currentChat]);

  // useEffect(() => {
  //   socket.socket.emit("addUser", user._id);
  //   socket.socket.on("getUsers", (users) => {
  //     setOnlineUsers(
  //       user.followedUsers.filter((f) => users.some((u) => u.userId === f))
  //     );
  //   });
  // }, [user]);

  // useEffect(() => {
  //   const getConversations = async () => {
  //     try {
  //       const res = await axios.get("/conversations/" + user._id);
  //       setConversations(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getConversations();
  // }, [user._id]);

  // useEffect(() => {
  //   const getMessages = async () => {
  //     try {
  //       const res = await axios.get("/messages/" + currentChat?._id);
  //       setMessages(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   getMessages();
  // }, [currentChat]);

  // useEffect(() => {
  //   console.log("getNotificationbesiktas")
  //   socket.socket.on("getNotification", (data) => {
  //     console.log("data in notif",data)
  //     setNotifications((prev) => [...prev, data]);
  //   })
  // }, []);


  const handleSubmit = async (e) => {

    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    console.log("message", message);

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    console.log("before sendMessage messenger")

    // socket.socket.emit("sendMessage", {
    //   senderId: user._id,
    //   receiverId,
    //   text: newMessage,
    // });

    // console.log("senderId before sendNotification", user._id);
    // console.log("receiverId sendNotification", receiverId);

    // socket.socket.emit("sendNotification", {
    //   senderId: user._id,
    //   receiverId,
    //   text: newMessage
    // });

    // try {
    //   const res = await axios.post("/messages", message); // dbye kaydolan kısım
    //   setMessages([...messages, res.data]);
    //   setNewMessage("");
    // } catch (err) {
    //   console.log(err);
    // }

  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const displayConsoleText = ({ senderId, text }) => {
    return (
      <span>{ `${senderId}: ${text} `}</span>
    )
  }


  // const handleCreateChat = async (receiverId) => {
  //   console.log("handleCreateChat");
  //   try {
  //     const res = await axios.post("/conversations", { senderId: user._id, receiverId });
  //     console.log("res.data", res.data);
  //     setConversations((prev) => {
  //       const newConversations = [...prev, res.data];
  //       return newConversations;
  //     }
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  const fetchLastMessageTimestamp = async (conversation) => {
    try {
      // const res = await axios.get("/messages/" + conversation._id);
      const res = await publicRequest.get("/messages/" + conversation._id);
      const lastMessage = res.data[res.data.length - 1];
      return {
        ...conversation,
        latestMessageTimestamp: lastMessage?.updatedAt
      };
    } catch (err) {
      console.log(err);
      return conversation; // Return conversation unchanged if there's an error
    }
  };

  useEffect(() => {
    const sortChatsByLastMessage = async () => {
      if (userChats && userChats.length) {
        const processedChats = await Promise.all(userChats.map((c) => fetchLastMessageTimestamp(c)));
        
        const sortedChats = processedChats.sort((a, b) => {
          return new Date(b.latestMessageTimestamp) - new Date(a.latestMessageTimestamp);
        });
  
        setSortedChats(sortedChats);
      }
    };
  
    sortChatsByLastMessage();
  }, [newMessage, notifications, userChats]);
  

  return (
    <>
    <div className="messenger">
      <div className="chatMenu">
        <span>
          {potentialChats.map((u, index) => (
            <div key={index} onClick={() => createChat(u._id)}>
              {u.username}
              <div className={ onlineUsers?.some((user) => user?.userId === u?._id) ? "online" : "" }></div>
              </div>
            ))}
        </span>
        <div>
          { sortedChats?.length < 1 ? null : ( // userChats
            <div className="flex justify-start">
              <div>
                { isUserChatsLoading && <p>Loading Chats...</p>}
                {sortedChats?.map((c, index) => (  // userChats
                  <div key={index} onClick={() => updateCurrentChat(c)}>
                  <Conversation conversation={c} currentUser={user} />
                </div>
              ))}
              </div>
            </div>
          )}
      </div>
      </div>
    <div className="chatBox">
        <div className="chatBoxWrapper">
              <div className="chatBoxTop">
                {messages?.map((m) => (
                  <div ref={scrollRef}>
                    <Message message={m} own={m.sender === user._id} />
                  </div>
                ))}
              </div>
              <div className="chatBoxBottom">
                <InputEmoji
                  className="chatMessageInput"
                  placeholder="write something..."
                  onChange={setTextMessage}
                  value={textMessage}
                  // onChange={setNewMessage}
                  // value={newMessage}
                  />
                <button className="chatSubmitButton" onClick={() => sendTextMessage(textMessage, user, currentChat?._id, setTextMessage)}>
                  Send
                </button>
              </div>
        </div>
      </div>
      <div className="chatOnline">
        <div className="flex mb-3">
            <button
              className={
                " text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3"
              }
              type="button"
              style={{ transition: "all .15s ease" }}
              onClick={() => setIsOpen(!isOpen)}
              >
              <MailIcon />
            </button>
          { unreadNotifications.length === 0 ? null : (
            <div className="">{unreadNotifications.length}</div>
            )}
        </div>
      { isOpen ? 
        <div className="flex flex-col">
          <div className="flex cursor-pointer">
            <h3>Notifications</h3>
            <div onClick={() => markAllNotificationsAsRead(notifications)}>Mark all as read</div>
          </div>

        { modifiedNotifications.length === 0 ? <span>No notification yet...</span> : null }

        { modifiedNotifications && 
            modifiedNotifications.map((n, index) => (
              <div 
                key={index} 
                className={`cursor-pointer ${n.isRead ? '' : 'not-read'}`}
                onClick={() => {
                  markNotificationAsRead(n, userChats, user, notifications);
                  setIsOpen(false)
                }}>
                    <span>{`${n.senderName} sent you a new message`}</span>
                    <span>{moment(n.date).calendar()}</span>
              </div>
          ) 
        )}
        </div> 
        : null}
      </div>
    </div>
  </>
  );
}


{/* <>
<Navbar />
<div>{allUsers.map(u => (
    <span onClick={() => handleCreateChat(u._id)}>{u.username}</span>
  ))}
</div>
<div className="messenger">
  <div className="chatMenu">
    <div className="chatMenuWrapper">
      <input placeholder="Search for friends" className="chatMenuInput" />
      {conversations.map((c) => (
        <div onClick={() => setCurrentChat(c)}>
          <Conversation conversation={c} currentUser={user} />
        </div>
      ))}
    </div>
  </div>
  <div className="chatBox">
    <div className="chatBoxWrapper">
      {currentChat ? (
        <>
          <div className="chatBoxTop">
            {messages.map((m) => (
              <div ref={scrollRef}>
                <Message message={m} own={m.sender === user._id} />
              </div>
            ))}
          </div>
          <div className="chatBoxBottom">
            <textarea
              className="chatMessageInput"
              placeholder="write something..."
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
            ></textarea>
            <button className="chatSubmitButton" onClick={handleSubmit}>
              Send
            </button>
          </div>
        </>
      ) : (
        <span className="noConversationText">
          Open a conversation to start a chat.

        </span>
      )}
    </div>
  </div>
  <div className="chatOnline">
  </div>
</div>
</> */}