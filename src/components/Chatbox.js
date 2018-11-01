import React from 'react';
import './Chatbox.css'
import ChatMessage from './ChatMessage'


  const Chatbox = ({chats, mode}) => (
    <div className="chat-history">
      <ul className="no-bullets">
      {chats.map(message => (
        <ChatMessage key={message.id} message={message} mode={mode} />
      ))}
      </ul>
    </div>
  );

export default Chatbox;
