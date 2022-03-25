import './Card.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = axios.create({
  baseURL: '/process'
});

function Card2({ user_name, avatar, status, date, image, video, format_review, className, btn_id, post_id, user_current_id, liked, haha, btn_delete_news_handle, btn_edit_news_handle, index }) {   //btn_id dùng xác định news này có nút hay ko, btn_id là id của news;  2 cái props btn là để add event onClick cho 2 cái nút để gọi hàm ở bên index.js

  const [rows, setRows] = useState('2');
  const [is_expand_more_status, setIs_expand] = useState(false);
  //const [flag_react_btn, setFlag] = useState();

  if(typeof(liked) === 'undefined'){    //nếu liked là undefined thì set lại giá trị là array rỗng, để tiện hơn khi code sau này (để ko bị lỗi và length sẽ = 0);
    liked = [];
  };
  if(typeof(haha) === 'undefined'){    //nếu liked là undefined thì set lại giá trị là array rỗng, để tiện hơn khi code sau này (để ko bị lỗi và length sẽ = 0);
    haha = [];
  };

  useEffect(() => {
    if (btn_id != '') {
      var btn_edit_post = document.getElementById(`btn-edit${btn_id}`);
      var btn_delete_post = document.getElementById(`btn-delete${btn_id}`);
      const delete_dialog = document.getElementById('delete-dialog');
      const postbar_container = document.getElementsByClassName('postbar-container');
      const close = document.getElementById('close-postbar-dialog');      //nút dấu x trên postbar
      var postbar_content = document.getElementById('postbar-content');
      var postbar_dropzone = document.querySelector('.dropzone-container');
      btn_edit_post.addEventListener('click', (e) => {
        btn_edit_news_handle(btn_id);   //truyền qua main để main truyền qua cho postbar data của post
        postbar_container[0].classList.remove('is_hide');
        postbar_container[0].classList.add('show-postbar');
        postbar_content.classList.remove('is_hide');
          postbar_dropzone.classList.remove('is_hide');
        close.addEventListener('click', () => {   //add event lại giống như event bên postbar, nếu ko thì khi nhấn button edit post thì dropzone vs textarea sẽ còn class is_hide, tương tự khi nhấn nút close thì ko add class is_hide vào giống như event đã add ở bên postbar.js
          postbar_container[0].classList.remove('show-postbar');
          postbar_container[0].classList.add('is_hide');
          postbar_content.classList.add('is_hide');
          postbar_dropzone.classList.add('is_hide');
        });
      });

      btn_delete_post.addEventListener('click', (e) => {
        //add event show hộp thoại delete riêng, truyền news id vào component delete
        btn_delete_news_handle(btn_id);   //btn_id là id của news cần xóa, hàm pass data qua cho main để Main pass qua cho deleteDialog
        delete_dialog.classList.remove('is_hide');
        delete_dialog.classList.add('show-postbar');    //class 'show-postbar' là chỉ để animation hiện dialog thôi, ko phải để hiện postbar 
      });
    };

    try {
      var line_rows_status = Math.round(status.split(' ').length / 10);   //hàm ước tính số hàng status của post để expand ra, trung bình 1 hàng có 11 từ
      var btn_see_more = document.getElementById(`card-btn-see-more${index}`);
      if (line_rows_status <= 2) {
        btn_see_more.style.display = 'none';  //ẩn nút see more khi status ít hơn hoặc bằng 2 hàng
      }
      btn_see_more.addEventListener('click', () => {
        if (is_expand_more_status) {
          setRows(2);
          //console.log(`click see more ${index} ${line_rows_status}`);
          setIs_expand(false);
        }
        else if (!is_expand_more_status) {
          setRows(line_rows_status);
          //console.log(`click see more ${index} ${line_rows_status}`);
          setIs_expand(true);
        }
      });
    }
    catch { }

  }, []);


  var foucusCard = (e) => {
    let card1 = document.getElementsByClassName('card-1');
    let card3 = document.getElementsByClassName('card-3');
    let card2 = document.getElementsByClassName('card-2');
    let i = 0;

    for (i = 0; i < card1.length; i++) {
      card1[i].style.marginLeft = "-17%";
    };
    for (i = 0; i < card3.length; i++) {
      card3[i].style.marginLeft = "80%";
    };
  };

  var reStateUI = (e) => {
    let card2 = document.getElementsByClassName('card-2');
    let card1 = document.getElementsByClassName('card-1');
    let card3 = document.getElementsByClassName('card-3');
    let i = 0;
    for (i = 0; i < card1.length; i++) {
      card1[i].style.marginLeft = "0%";
    };
    for (i = 0; i < card3.length; i++) {
      card3[i].style.marginLeft = "55%";
    };
  };

  
  let is_display_video = 'card-not-display';
  let is_display_image = 'card-not-display';
  try {
    if (!video.includes('undefined') && image.includes('undefined')) {       //chỉ có video
      is_display_video = 'card-display';
      is_display_image = 'card-not-display';
    }
    else if (video.includes('undefined') && !image.includes('undefined')) {      //chỉ có images
      is_display_video = 'card-not-display';
      is_display_image = 'card-display';
    }
    else if (!video.includes('undefined') && !image.includes('undefined')) {      //có cả img và video
      is_display_video = 'card-display';
      is_display_image = 'card-display';
    };
  }
  catch (err) {
    //console.log(err);
  };


  function handle_like_btn(e) {
    if (e.target.textContent === 'Like') {
      let id = e.target.value.slice(4);   //bỏ đi chữ like ở trước, chỉ còn lại id ở sau, id này là của post dc like
      var update_following = {};
      update_following.query = { Id: id };
      update_following.newvalues = { liked: user_current_id };
      API.post(`/post-push`, update_following)    //thêm id user like post vào array liked của post tương ứng
        .then(function (response) {
          e.target.textContent = 'Dislike';
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
    else if (e.target.textContent === 'Dislike') {
      let id = e.target.value.slice(4);   //bỏ đi chữ like ở trước, chỉ còn lại id ở sau, id này là của post dc dislike
      var update_following = {};
      update_following.query = { Id: id };
      update_following.newvalues = { liked: user_current_id };
      API.post(`/post-pull`, update_following)    //xóa id user dislike post ra khỏi array liked của post tương ứng
        .then(function (response) {
          e.target.textContent = 'Like';
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
  };

  
  function handle_haha_btn(e) {
    if (e.target.textContent === 'Haha') {
      let id = e.target.value.slice(4);   //bỏ đi chữ haha ở trước, chỉ còn lại id ở sau, id này là của post dc haha
      var update_following = {};
      update_following.query = { Id: id };
      update_following.newvalues = { haha: user_current_id };
      API.post(`/post-push`, update_following)    //thêm id user haha post vào array haha của post tương ứng
        .then(function (response) {
          e.target.textContent = 'Unhaha';
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
    else if (e.target.textContent === 'Unhaha') {
      let id = e.target.value.slice(4);   //bỏ đi chữ haha ở trước, chỉ còn lại id ở sau, id này là của post dc Unhaha
      var update_following = {};
      update_following.query = { Id: id };
      update_following.newvalues = { haha: user_current_id };
      API.post(`/post-pull`, update_following)    //xóa id user Unhaha post ra khỏi array haha của post tương ứng
        .then(function (response) {
          e.target.textContent = 'Haha';
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
  };

  

  return (
    <div className={`${className}`} onClick={foucusCard} onMouseOut={reStateUI}>   {/*id={btn_id}*/}
      <header className="w3-container">
        <br />
        <h4> <img className="round-avatar-card" src={avatar} /> {user_name} </h4>
        <p style={{ fontSize: '10px', marginLeft: '9%', marginTop: '-4%' }}> {date} {btn_id != '' ? (<div><button id={`btn-edit${btn_id}`} className="card-btn-edit"> Edit this </button> <button id={`btn-delete${btn_id}`} className="card-btn-delete"> Delete this </button></div>) : null}</p>   {/*nếu btn_id có giá trị id => thêm nút eidt và delete vào, set value là id của news để bên index.js lấy e.target.value trong hàm btn_edit_news_handle để set lại cho posrtbar component*/}
      </header>
      <video className={is_display_video} src={video} muted controls></video>
      <img className={` ${is_display_image}`} src={image} />
      <textarea className="card-status-content" style={format_review} value={status} spellCheck="false" rows={rows}> </textarea>
      <button className="card-btn-see-more" id={`card-btn-see-more${index}`} type="button">See more...</button>
      {
        (liked.indexOf(user_current_id) != -1) ? <button value={`like${post_id}`} onClick={handle_like_btn} >Dislike</button> : <button value={`like${post_id}`} onClick={handle_like_btn} >Like</button>
      }
      {
        (haha.indexOf(user_current_id) != -1) ? <button value={`haha${post_id}`} onClick={handle_haha_btn} >Unhaha</button> : <button value={`haha${post_id}`} onClick={handle_haha_btn} >Haha</button>
      }
      {
        (liked.indexOf(user_current_id) != -1) ? <p>{`Bạn và ${liked.length - 1} người khác thích post này`}</p> : <p>{`${liked.length} người khác thích post này`}</p>
      }
    </div>
  );
};


export default Card2;

//card 2 review trong postbar còn hiện nút seemore là do index trong đó là undefined