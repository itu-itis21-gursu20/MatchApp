import React from 'react'
import "./message.css";
import { format } from "timeago.js"

const Message = ({ message, own }) => {
  return (
    <div className={own ? "message own" : "message"}>
        <div className="messageTop">
            <img className='messageImg' src="https://iaatv.tmgrup.com.tr/84b456/0/0/0/0/0/0?u=https://iatv.tmgrup.com.tr/album/2023/07/01/3-bolum-foto-galeri-1688203834105.jpg" alt="" />
            <p className='messageText'>{message.text}</p>
        </div>
        <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}

export default Message