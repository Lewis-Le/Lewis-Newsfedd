import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import {socket} from "../../../service/socket";
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

const ENDPOINT = 'http://localhost:3000';    //địa chỉ server

const Chat = ({ name, room }) => {
  //const [name, setName] = useState('');
  //const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    //const { name, room } = queryString.parse(location.search);

    //console.log(name, room);

    //setRoom(room);
    //setName(name);

    socket.emit('join', { name, room }, (error) => {
      if (error) {
        //alert(error);
        console.log(error);
      }
    });
  }, [ENDPOINT, name, room]);

  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [...messages, message]);
    });

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <div >
      <div className="Chat-container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      {/* <TextContainer users={users}/> */}
    </div>
  );
}

export default Chat;
