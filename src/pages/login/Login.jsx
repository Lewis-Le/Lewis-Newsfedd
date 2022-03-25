import "./login.scss";
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { socket } from "../../service/socket";

const API_login = axios.create({
  baseURL: 'http://localhost:3000'
});

export default function Login({ passUserData, is_login }) {
  const [user, setUser] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [message, setMessage] = useState('');
  let history = useHistory();

  if (is_login === 'true') {
    passUserData(JSON.parse(localStorage.getItem("userData")));
  };

  function login(userData) {
    localStorage.setItem("accessToken", true);
    localStorage.setItem("userData", JSON.stringify(userData));
    passUserData(userData);
    socket.emit('send-online-status', userData.user_name, (error) => {
      if (error) {
        //alert(error);
        console.log(error);
      }
    });
    history.replace("/");
  };

  function handleEmail(e) {
    //console.log(e.target.value);
    setMessage("");
    setEmail(e.target.value);
  }
  function handlePassword(e) {
    //console.log(e.target.value);
    setMessage("");
    setPassword(e.target.value);
  };

  function handle_login(e) {
    e.preventDefault();
    //console.log('handle login');
    let login_data = {};
    login_data.email = email;
    login_data.password = password;
    API_login.post('/', login_data).then(function (res) {
      //console.log(res.data);
      if (res.data.Id) {
        setUser(res.data);
        login(res.data);
        //console.log('login done');
      }
      else if (!res.data.Id) {
        setMessage("Tài khoản đăng nhập không đúng!");
      }
    });
  };

  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <h2 className="login-page-title">Lewis Newsfeed</h2>

        </div>
      </div>
      <div className="container">
        <form>
          <h1>Sign In <button className="SignupButton" type="button" onClick={() => window.location.href = "/register"}>Create new account</button></h1>
          <input className="input" onChange={handleEmail} type="email" placeholder="Email" />
          <input className="input" onChange={handlePassword} type="password" placeholder="Password" />
          <button onClick={handle_login} type="submit" className="loginButton">Sign In</button>
          <small>
            <p> {message} </p>
          </small>
        </form>
      </div>
    </div>
  );
}
