import React from 'react';
import './Chatbox.css'
import ChatMessage from './ChatMessage'


  const Chatbox = ({chats, mode, changecontext}) => console.log(chats) || (
    <div className="chat-history">
      <ul className="no-bullets">
      {chats.map(message => {
        if (message.content === 'Test') {
          //changecontext([{name: "Get Facebook"}]);
        } else {
          return <ChatMessage key={message.id} message={message} mode={mode} />
        }

      })}
      </ul>
    </div>
  );

export default Chatbox;
