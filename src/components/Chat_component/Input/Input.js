import React from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message }) => (
  // <form className="form">

  <div className="chatbar">
    <button className="chatbar-btn">
      <span className="mdi mdi-plus"></span>
      <ul className="chatbar-icons">
        <li className="chatbar-li"><a><span className="mdi mdi-video-outline"></span></a></li>
        <li className="chatbar-li"><a><span className="mdi mdi-camera-enhance-outline"></span></a></li>
        <li className="chatbar-li"><a><span className="mdi mdi-image-outline"></span></a></li>
      </ul>
      <div className="inputfield">
        <input
          className="input-chat"
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={({ target: { value } }) => setMessage(value)}
          onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
        />
      </div>
    </button>
  </div>



  // {/* <input
  //   className="input-chat"
  //   type="text"
  //   placeholder="Type a message..."
  //   value={message}
  //   onChange={({ target: { value } }) => setMessage(value)}
  //   onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
  // />
  // <button className="sendButton" onClick={e => sendMessage(e)}>+</button> */}
  // {/* </form> */}

)

export default Input;