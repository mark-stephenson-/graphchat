import React from 'react';
import TimeAgo from 'react-timeago';
import './Chatbox.css'

const ChatCard = ({person, onclick}) => (
  <li className="clearfix" onClick={() => onclick(person.from)}>
    <img src="https://res.cloudinary.com/pockethighst/image/upload/c_scale,w_30/v1540494616/jo/avatar/default-avatar.png" alt="avatar" />
    <div className="about">
      <div className="name">{person.from}</div>
      <div className="status">
        <i className="fa fa-circle online"></i> online
      </div>
      <div className="last-seen">
        <i className="fa fa-circle online"></i> <TimeAgo date={person.createdAt} />
      </div>
    </div>
  </li>
);

export default ChatCard;
