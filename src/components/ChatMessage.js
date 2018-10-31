import React from 'react';
import './ChatMessage.css'

  const Chatbox = ({message, mode}) => (

    <li className="clearfix">
        {
          message.from !== 'Jo' ?
          <div className="logo-block">
            <div className="logo"><img src="https://res.cloudinary.com/pockethighst/image/upload/c_scale,w_15/v1540494616/jo/avatar/default-avatar.png" /></div>
            <div className="message my-message">
           {message.content}
           </div>
          </div>
          :
          <div className="logo-block">
            <div className="float-right logo"><img src="http://res.cloudinary.com/pockethighst/image/upload/h_15,w_15/v1518432206/jo/logo/green" /></div>
            <div className="message other-message float-right">
             {message.content}
            </div>
          </div>
        }
    </li>
  );

export default Chatbox;
