import './App.css';
import { useState, Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useParams, Redirect } from 'react-router-dom';
import Register from './pages/register/Register';
import Login from './pages/login/Login';
import Main from './pages/main/Main';
import Profile_privite from './pages/profile/Profile';
import { render } from '@testing-library/react';


function App() {

  const [user, setUser] = useState();

  function receivePassUserData(userData) {
    setUser(userData);
  }

  function ProtectedRoute() {
    let isAuth = localStorage.getItem("accessToken");
    if (isAuth === 'true') {
      return <Main user={JSON.parse(localStorage.getItem("userData"))} />
    }
    else {
      return <Login is_login={isAuth} passUserData={receivePassUserData} />
    }
  };

  return (
    <>
      <Router>
        <Switch>

          <Route exact path="/" component={ProtectedRoute} />

          <Route exact path="/chat" component={ProtectedRoute} />

          <Route path="/login" render={() => {
            let isAuth = localStorage.getItem("accessToken");
            return (isAuth === 'true') ? <Main user={user} /> : <Login is_login={isAuth} passUserData={receivePassUserData} />
          }}>
          </Route>

          <Route path="/register" render={() => {
            return <Register />
          }}></Route>

          <Route path="/profile" render={() => {
            let isAuth = localStorage.getItem("accessToken");
            if (isAuth === 'true') {
              return <Profile_privite user={JSON.parse(localStorage.getItem("userData"))} />
            }
            else {
              return <Login is_login={isAuth} passUserData={receivePassUserData} />
            }
          }}></Route>

        </Switch>
      </Router>
    </>
  );
};


export default App;
