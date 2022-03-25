import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './Navbarbot.css';
import { Redirect } from 'react-router-dom';
import { MDBBtn } from "mdbreact";
import axios from 'axios';

const API = axios.create({
  baseURL: '/process'
});

function Navbarbot({ avatar, user_current_id }) {

  const [search_keyword, setSearch_keyword] = useState();

  useEffect(() => {
    function show_result() {   //hàm xử lý hiển thị search result
      //console.log(search_keyword);
      var div_result_parent = document.getElementById('search-result');
      //let keyword = document.getElementById('keyword');
      //keyword.textContent = search_keyword;

      function removeAllChildNodes(parent) {    //hàm xóa hết child trong 1 element
        parent.querySelectorAll('*').forEach(n => n.remove());
        //parent.classList.remove('is-expand');
      };
      removeAllChildNodes(div_result_parent);   //nếu notfound thì .then() sẽ ko chạy nhưng cũng ko catch(), => mỗi lần keyword thay đổi mà chưa chạy .then()(tức notfound) thì sẽ xóa các result trước, nếu có thì result sẽ hiện sau khi chạy .then()

      API.get(`/userss/${search_keyword}`, {
      })
        .then(function (response) {
          let i = 0;
          //div_result_parent.classList.add('is-expand');

          for (const item_result of response.data) {
            //console.log(response);
            let some_cards = document.createElement('div');
            some_cards.setAttribute('id', `some-search-items${i}`);
            div_result_parent.append(some_cards);
            ReactDOM.render(
              <React.StrictMode>
                <div id={`result${i}`} className="item-search-result">
                  <img id="result-avatar" className="round-avatar" src={`http://localhost:3000/${item_result.avatar}`} />
                  <div className="item-search-result-info">
                    <h4 id="user-name-result">{item_result.name}</h4>
                    <h5 id="user-bref-info" style={{ marginTop: '-27px' }}>Work at Pioze group holdings</h5>
                  </div>
                  <div className="item-search-result-btn">
                    {
                      (item_result.followers.indexOf(user_current_id) !== -1) ? <button value={`follow${item_result.Id}`} onClick={handleFollow}>Unfollow</button> : <button value={`follow${item_result.Id}`} onClick={handleFollow}>Follow</button>
                    }
                    {
                      (item_result.friend_req.indexOf(user_current_id) !== -1) ? <button value={`addfriend${item_result.Id}`} onClick={handleAddFriend}>Unsend friend require</button> : <button value={`addfriend${item_result.Id}`} onClick={handleAddFriend}>Add friend</button>
                    }
                    
                  </div>
                </div>
              </React.StrictMode>,
              document.getElementById(`some-search-items${i}`)
            );
            i = i + 1;
          };

        })
        .catch(function (error) {   //nếu trống(ko phải notfound) thì res trả về sẽ ko có => bị lỗi và chuyển qua catch, khi nào có data trả về thì mới run trong .then()
          //console.log(error);
          removeAllChildNodes(div_result_parent);
        });
    };

    show_result();

  }, [search_keyword]);


  function logout() {
    localStorage.setItem("accessToken", false);
    localStorage.removeItem("userData");
    window.location.reload();
  };

  function nav_to_privite_profile() {
    window.location.href = '/profile';
  };


  function on_search_handle(e) {   //hàm set biến search_keyword mỗi khi onchange trong searchbar, mỗi lần biến search_keyword thay đổi thì sẽ gọi useEffect
    //console.log(e.target.value);
    setSearch_keyword(e.target.value);
  };


  function handleFollow(e) {
    if (e.target.textContent === 'Follow') {
      let id = e.target.value.slice(6);   //bỏ đi chữ follow ở trước, chỉ còn lại id ở sau, id này là của user dc follow
      var update_following = {};
      update_following.query = { Id: user_current_id };
      update_following.newvalues = { following: id };
      API.post(`/user-push`, update_following)    //thêm id user dc theo dõi vào array following của user đang login hiện tại
        .then(function (response) {
        })
        .catch(function (error) {
          //console.log(error);
        });
      update_following.query = { Id: id };
      update_following.newvalues = { followers: user_current_id };
      API.post(`/user-push`, update_following)    //thêm id user đang login hiện tại vào array follower của user dc theo dõi
        .then(function (response) {
          e.target.textContent = 'Unfollow';    //đổi tên button
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
    else if (e.target.textContent === 'Unfollow') {
      let id = e.target.value.slice(6);   //bỏ đi chữ follow ở trước, chỉ còn lại id ở sau, id này là của user dc unfollow
      var update_following = {};
      update_following.query = { Id: user_current_id };
      update_following.newvalues = { following: id };
      API.post(`/user-pull`, update_following)    //xóa id user dc theo dõi trong array following của user đang login hiện tại
        .then(function (response) {
        })
        .catch(function (error) {
          //console.log(error);
        });
      update_following.query = { Id: id };
      update_following.newvalues = { followers: user_current_id };
      API.post(`/user-pull`, update_following)    //xóa id user đang login hiện tại trong array follower của user dc theo dõi
        .then(function (response) {
          e.target.textContent = 'Follow';
        })
        .catch(function (error) {
          //console.log(error);
        });
    };
  };


  function handleAddFriend(e) {
    if (e.target.textContent === 'Add friend') {
      let id = e.target.value.slice(9);   //bỏ đi chữ addfriend ở trước, chỉ còn lại id ở sau, id này là của user dc add friend
      var update_addfriend = {};
      update_addfriend.query = { Id: id };
      update_addfriend.newvalues = { friend_req: user_current_id };
      API.post(`/user-push`, update_addfriend)    //thêm id user hiện tại vào array friend_req của user dc addfriend
        .then(function (response) {
          e.target.textContent = 'Unsend friend require';
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
    else if (e.target.textContent === 'Unsend friend require') {
      let id = e.target.value.slice(9);   //bỏ đi chữ addfriend ở trước, chỉ còn lại id ở sau, id này là của user dc add friend
      var update_addfriend = {};
      update_addfriend.query = { Id: id };
      update_addfriend.newvalues = { friend_req: user_current_id };
      API.post(`/user-pull`, update_addfriend)    //xóa id user hiện tại trong array friend_req của user dc addfriend
        .then(function (response) {
          e.target.textContent = 'Add friend';
        })
        .catch(function (error) {
          //console.log(error);
        });
    };
  };



  return (

    <div className="navbartop">
      <ul className="menu-bar">
        <li><input type="text" name="search" placeholder="Search" onChange={on_search_handle} /></li>
        <li>Groups</li>
        <li>Pages</li>
        <li onClick={nav_to_privite_profile}><img className="round-avatar" src={avatar} /></li>
        <li>Message</li>
        <li>Notifications</li>
        <li onClick={logout}>Logout</li>
      </ul>

      <div id="search-result" className="search-result">
        <h2 id="keyword"></h2>
      </div>

    </div>
  );
};


export default Navbarbot;