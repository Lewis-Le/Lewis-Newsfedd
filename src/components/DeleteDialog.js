import './Postbar.css';
import './Card.css';
import Card_review from './Card2';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from "../service/socket";

const API = axios.create({
  baseURL: '/process'
});


export default function App({ user_name, user_avatar, user_id, news_id, passData_remove_post }) {

  const [content_review, setContent_review] = useState();
  const [format_review, setFormat_review] = useState();
  const [videosrc, setVideosrc] = useState();
  const [imgsrc, setImgsrc] = useState();
  const [imgs, setImgs] = useState();
  // const [news_id_ogrin, setNews_id_ogrin] = useState();

  try {
    var news_id_ogrin = news_id.slice(5);   //xóa bỏ phần rand 5 số đầu của news_id bên Main.js gửi qua
  } catch { }


  useEffect(() => {
    var delete_dialog_container = document.getElementsByClassName('postbar-container');   //query bằng className => có 2 cái trùng className là postbar với delete dialog => [0] là postbar, [1] là delete dialog
    var close_delete_dialog = document.getElementById('close-delete-dialog');
    close_delete_dialog.addEventListener('click', onClickClose);  //add event cho nút close delete dialog
    var delete_dialog_post_btn = document.getElementById(`deleteDialog-btn-delete-post${news_id_ogrin}`);
    delete_dialog_post_btn.addEventListener('click', onClickDelete);  //add event cho nút delete post trong delete dialog

    onchange_delete_dialog_data();

    function onClickDelete() {
      delete_post_handle(news_id_ogrin);  //hàm xử lý gửi req đến server xóa post
      delete_dialog_container[1].classList.remove('show-postbar');
      delete_dialog_container[1].classList.add('is_hide');
      //passData_remove_post(news_id_ogrin);  //passData qua cho Main.js để nó thực hiện hàm xóa post hiển thị trên ui
      socket.emit('send-delete-post', news_id_ogrin, (error) => {   //dùng socket rồi thì ko cần dùng passData qua cho parent bên Main.js nữa
        if (error) {
          console.log(error);
        }
      });
      try {
        close_delete_dialog.removeEventListener('click', onClickClose);
        delete_dialog_post_btn.removeEventListener('click', onClickDelete);
      }
      catch { }
    };

    function onClickClose() {
      setContent_review('');
      setImgsrc('undefined');
      setVideosrc('undefined');
      try {
        delete_dialog_post_btn.removeEventListener('click', onClickDelete);
      }
      catch { }
      delete_dialog_container[1].classList.remove('show-postbar');
      delete_dialog_container[1].classList.add('is_hide');
    };

  }, [news_id]);   //để trống là always run mỗi lần render, còn [] thì run 1 lần duy nhất, [news_id_ogrin] là chỉ run khi news_id_ogrin thay đổi



  function onchange_delete_dialog_data() {    //mỗi lần news_id_ogrin truyền vào thay đổi(khi bấm nút delete các post khác nhau) là get news data lại rồi set giá trị lại render ra thành card review
    API.get(`/single_news/${news_id_ogrin}`, {})
      .then((res) => {
        //console.log(`in onChange newsID = ${news_id_ogrin}`);
        setContent_review(res.data[0].news_type.status);
        setImgsrc(`/${res.data[0].news_type.image[0]}`);
        setVideosrc(`/${res.data[0].news_type.video[0]}`);
      })
      .catch((error) => { });
  };



  function delete_post_handle(news_id_ogrin) {  //hàm xử lý gửi req xóa post trong database với xóa file trên server
    API.post(`/delete_single_news/${news_id_ogrin}`, {})
      .then((res) => {
        console.log(res);
        setContent_review('');
        setImgsrc('undefined');
        setVideosrc('undefined');
      })
      .catch((error) => { });
  };


  return (
    <>
      <div>
        <div id="delete-dialog" className="postbar-container is-hide">
          <span id="close-delete-dialog" className="close"> &#10006; </span>
          <div className="postbar-body display-inline-flex">
            <div className="col-sm-8">
              <div className="display-inline-flex">
                <h4>Delete post</h4>
              </div>
              <hr />
              <p>Are you sure to delete this post? This action can not be undo!</p>
              <p>All comment, media and reaction in this post will be removed</p>
              <p>ID post: {news_id_ogrin}</p>
              <button className="postbar-btn" type="button" id={`deleteDialog-btn-delete-post${news_id_ogrin}`}>Yes, DELETE this post</button>
            </div>
            <div style={{ zoom: '70%' }}>
              <Card_review btn_id="" className="card2-wrap-review" user_name={user_name} status={content_review} image={imgsrc} video={videosrc} avatar={user_avatar} format_review={format_review} />   {/* do là card review nên set cố định btn_id='' để ko hiển thị nút */}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


//bị bug nhấn vào nút delete this mà ko xóa r close lại, thì khi nhấn lại lần nữa không xóa dc post, cũng không review dc post


