import './Postbar.css';
import './Card.css';
import Dropzone from './Dropupload'
import Card_review from './Card2';
import React, { useState, useEffect, useMemo } from 'react';
import { ChromePicker } from 'react-color';
import axios from 'axios';
import { socket } from "../service/socket";

const API = axios.create({
  baseURL: '/process'
});

export default function App({ user_name, user_avatar, user_id, news_id, i, user, passData_remove_postData, passData_load_latest_card }) {     //news_id để xác định là new post hay edit post
  const [content_review, setContent_review] = useState();
  const [format_review, setFormat_review] = useState();
  const [media_review, setMedia_review] = useState();
  const [videosrc, setVideosrc] = useState();
  const [imgsrc, setImgsrc] = useState();
  const [imgs, setImgs] = useState();
  const [news_data, setNews_data] = useState();

  var loop_prevent = 0;

  useEffect(() => {
    const postbar_container = document.getElementsByClassName('postbar-container');
    var postbar_content = document.getElementById('postbar-content');
    var postbar_dropzone = document.querySelector('.dropzone-container');
    let textarea_content = document.getElementById('postbar-content');
    if (news_id != '') {
      API.get(`/single_news/${news_id}`, {
      })
        .then(function (response) {
          textarea_content.value = response.data[0].news_type.status;
          setContent_review(response.data[0].news_type.status);
          setImgs(response.data[0].news_type.image.concat(response.data[0].news_type.video));
          //cho ẩn nút post
          //cho hiện nút update
          //Phần xử lý khi nhấn nút UPDATE
          const postbar_btn_update_post = document.getElementById('postbar-btn-update-post');
          postbar_btn_update_post.addEventListener('click', postUpdateHandle);
          function postUpdateHandle(e) {
            e.preventDefault();
            let content = document.getElementById('postbar-content').value;
            let imgs = document.getElementsByClassName('uploaded-img');
            let videos = document.getElementsByClassName('uploaded-video');
            let format = document.getElementById('postbar-content').style;

            var newvalues = {};
            newvalues.type = 'news';
            newvalues.news_type.status = content;
            try {
              newvalues.news_type.image = `users/${user.Id}/media/${imgs[0].src.slice(30)}`;   //slice để xóa phần src="http://localhost:3000/uploads/" ở phía trc, còn lại <tên file>
              newvalues.imageOld = imgs[0].src.slice(22);  //slice để xóa phần src="http://localhost:3000/ còn lại uploads/<ten file> hoặc users/<tên file>
            }
            catch {
              //console.log('ko upload img');
            };
            try {
              newvalues.news_type.video = `users/${user.Id}/media/${videos[0].src.slice(30)}`;   //slice để xóa phần src="http://localhost:3000/uploads/" ở phía trc, còn lại <tên file>
              newvalues.videoOld = videos[0].src.slice(22);  //slice để xóa phần src="http://localhost:3000/ còn lại uploads/<ten file> hoặc users/<tên file>
            }
            catch {
              //console.log('ko upload video');
            }
            newvalues.format_font = format;
            newvalues.is_blocked = '';

            var update_post = {};   //biến dữ liệu truyền qua cho server
            update_post.query = { Id: news_id };
            update_post.newvalues = newvalues;
            API.post(`/post-set`, update_post).then(function (res) {
              API.get(`/single_news/${news_id}`, {
              })
                .then(function (response) {
                  news_data = response.data;
                  console.log(news_data);
                  //passData_load_updated_card(i, response.data);    //pass data qua cho Main.js gọi hàm load card vừa mới đăng, biến i này là lấy từ biến i chỉ dùng trong useEffect của Main.js rồi truyền qua <postbar>, rồi bây h từ <postbar> truyền qua lại cho hàm load_latest_card trong Main.js (vì bên Main.js chưa dùng chung biến i cho trong useEffect và hàm ngoài useEffect dc)
                  socket.emit('send-update-post', response.data, (error) => {   //dùng socket rồi thì ko cần dùng passData qua cho parent bên Main.js nữa
                    if (error) {
                      console.log(error);
                    }
                  });
                  //i = i+1;
                })
                .catch(function (error) {
                  //console.log(error);
                })
            });
            //console.log('post handling ... done');
            postbar_container[0].classList.remove('show-postbar');
            postbar_container[0].classList.add('is_hide');
            postbar_content.classList.add('is_hide');
            postbar_dropzone.classList.add('is_hide');
            postbar_btn_update_post.removeEventListener("click", postUpdateHandle);
          };
        })
        .catch(function (error) {
          //console.log(error);
        });
    }
    else if (news_id === '') {
      textarea_content.value = '';
      setContent_review('');
      setImgs([]);
      //cho ẩn nút update
      //cho hiện nút post
      //Phần xử lý khi nhấn nút POST
      const postbar_btn_add_post = document.getElementById('postbar-btn-add-post');
      postbar_btn_add_post.addEventListener('click', postHandle);
      function postHandle(e) {
        e.preventDefault();
        let content = document.getElementById('postbar-content').value;
        let imgs = document.getElementsByClassName('uploaded-img');
        let videos = document.getElementsByClassName('uploaded-video');
        let format = document.getElementById('postbar-content').style;
        var news_data_post = {};
        news_data_post.user_id = user.Id;
        news_data_post.user_name = user.user_name;
        news_data_post.user_avatar = user.user_avatar;
        news_data_post.type = 'news';
        news_data_post.status = content;
        try {
          news_data_post.image = `users/${user.Id}/media/${imgs[0].src.slice(30)}`;   //slice để xóa phần src="http://localhost:3000/uploads/" ở phía trc, còn lại <tên file>
          news_data_post.imageOld = imgs[0].src.slice(22);  //slice để xóa phần src="http://localhost:3000/ còn lại uploads/<ten file>
        }
        catch {
          //console.log('ko upload img');
        };
        try {
          news_data_post.video = `users/${user.Id}/media/${videos[0].src.slice(30)}`;   //slice để xóa phần src="http://localhost:3000/uploads/" ở phía trc, còn lại <tên file>
          news_data_post.videoOld = videos[0].src.slice(22);  //slice để xóa phần src="http://localhost:3000/ còn lại uploads/<ten file>
        }
        catch {
          //console.log('ko upload video');
        }
        news_data_post.format_font = format;
        news_data_post.is_blocked = '';
        API.post('/add_news', news_data_post).then(function (res) {
          API.get(`/news/all/1`, {
          })
            .then(function (response) {
              news_data = response.data;
              //console.log(news_data);
              //passData_load_latest_card(i, response.data);    //pass data qua cho Main.js gọi hàm load card vừa mới đăng, biến i này là lấy từ biến i chỉ dùng trong useEffect của Main.js rồi truyền qua <postbar>, rồi bây h từ <postbar> truyền qua lại cho hàm load_latest_card trong Main.js (vì bên Main.js chưa dùng chung biến i cho trong useEffect và hàm ngoài useEffect dc)
              socket.emit('send-add-new-post', response.data, (error) => {   //dùng socket rồi thì ko cần dùng passData qua cho parent bên Main.js nữa
                if (error) {
                  console.log(error);
                }
              });
              //i = i+1;
            })
            .catch(function (error) {
              //console.log(error);
            })
        });
        //console.log('post handling ... done');
        postbar_container[0].classList.remove('show-postbar');
        postbar_container[0].classList.add('is_hide');
        postbar_content.classList.add('is_hide');
        postbar_dropzone.classList.add('is_hide');
        postbar_btn_add_post.removeEventListener('click', postHandle);
      };
    };

  }, [news_id]);



  function onContentChange(e) {
    //console.log(e.target.value);
    setContent_review(e.target.value);
  };

  function onFormatChange(e) {
    setFormat_review({ fontSize: `${e.target.value}px`, backgroundColor: 'none', marginLeft: '4%', marginTop: '1%' });
    //console.log(format_review);
  };

  function onImgChange(child_data) {
    try {
      setMedia_review(media_review.concat(child_data));
      //console.log(`child: ${child_data}`);
      try {
        if (!child_data[0].includes('.mp4')) {
          setImgsrc(child_data[0]);
          setVideosrc('undefined');
        }
        else if (child_data[0].includes('.mp4')) {
          setVideosrc(child_data[0]);
          setImgsrc('undefined');
        }
        else if (child_data[0].includes('.mp4') && !child_data[1].includes('.mp4')) {
          setVideosrc(child_data[0]);
          setImgsrc(child_data[1]);
        }
        else if (!child_data[0].includes('.mp4') && child_data[1].includes('.mp4')) {
          setVideosrc(child_data[1]);
          setImgsrc(child_data[0]);
        };
      }
      catch (err) {
        setImgsrc('undefined');     //trường hợp child_data ko còn img hay video nào
        setVideosrc('undefined');
        //console.log(err);
      };
    }
    catch {
      setMedia_review(child_data);
      //console.log(media_review);
      //console.log(child_data[0]);
      try {
        if (!child_data[0].includes('.mp4')) {
          setImgsrc(child_data[0]);
          setVideosrc('undefined');
        }
        else if (child_data[0].includes('.mp4')) {
          setVideosrc(child_data[0]);
          setImgsrc('undefined');
        }
        else if (child_data[0].includes('.mp4') && !child_data[1].includes('.mp4')) {
          setVideosrc(child_data[0]);
          setImgsrc(child_data[1]);
        }
        else if (!child_data[0].includes('.mp4') && child_data[1].includes('.mp4')) {
          setVideosrc(child_data[1]);
          setImgsrc(child_data[0]);
        };
      }
      catch (err) {
        setImgsrc('undefined');     //trường hợp child_data ko còn img hay video nào
        setVideosrc('undefined');
        //console.log(err);
      };
    };
  };


  useEffect(() => {
    function main_handle() {
      const show_postbar_btn = document.querySelector('.show-postbar-btn');
      const postbar_container = document.getElementsByClassName('postbar-container');     //query bằng className => có 2 cái trùng className là postbar với delete dialog => [0] là postbar, [1] là delete dialog
      const close = document.getElementById('close-postbar-dialog');      //nút dấu x trên postbar
      var postbar_content = document.getElementById('postbar-content');
      var postbar_dropzone = document.querySelector('.dropzone-container');
      show_postbar_btn.addEventListener('click', () => {
        postbar_container[0].classList.remove('is_hide');
        postbar_content.classList.remove('is_hide');
        postbar_dropzone.classList.remove('is_hide');
        postbar_container[0].classList.add('show-postbar');
      });
      close.addEventListener('click', () => {
        postbar_container[0].classList.remove('show-postbar');
        postbar_container[0].classList.add('is_hide');
        postbar_content.classList.add('is_hide');
        postbar_dropzone.classList.add('is_hide');
        passData_remove_postData(news_id);    //callback qua cho Main.js để set lại news_id là rỗng, để ko lưu sót lại data trên postbar
      });
      const postbar_tag_media_btn = document.getElementById('postbar-tag-btn-1');
      const postbar_tag_1 = document.querySelector('.postbar-tag-1')
      postbar_tag_media_btn.addEventListener('click', () => {
        postbar_tag_1.classList.add('postbar-show-tag');
        postbar_tag_2.classList.remove('postbar-show-tag');
        postbar_tag_3.classList.remove('postbar-show-tag');
        postbar_tag_4.classList.remove('postbar-show-tag');
      });
      const postbar_tag_content_btn = document.getElementById('postbar-tag-btn-2');
      const postbar_tag_2 = document.querySelector('.postbar-tag-2')
      postbar_tag_content_btn.addEventListener('click', () => {
        postbar_tag_2.classList.add('postbar-show-tag');
        postbar_tag_1.classList.remove('postbar-show-tag');
        postbar_tag_3.classList.remove('postbar-show-tag');
        postbar_tag_4.classList.remove('postbar-show-tag');
      });
      const postbar_tag_format_btn = document.getElementById('postbar-tag-btn-3');
      const postbar_tag_3 = document.querySelector('.postbar-tag-3')
      postbar_tag_format_btn.addEventListener('click', () => {
        postbar_tag_3.classList.add('postbar-show-tag');
        postbar_tag_1.classList.remove('postbar-show-tag');
        postbar_tag_2.classList.remove('postbar-show-tag');
        postbar_tag_4.classList.remove('postbar-show-tag');
      });
      const postbar_tag_more_btn = document.getElementById('postbar-tag-btn-4');
      const postbar_tag_4 = document.querySelector('.postbar-tag-4')
      postbar_tag_more_btn.addEventListener('click', () => {
        postbar_tag_4.classList.add('postbar-show-tag');
        postbar_tag_1.classList.remove('postbar-show-tag');
        postbar_tag_2.classList.remove('postbar-show-tag');
        postbar_tag_3.classList.remove('postbar-show-tag');
      });

      //Phần xử lý thanh kéo slider format font
      const slider = document.getElementById('slider');
      const fill = document.querySelector(".bar .fill");
      const text_size = document.getElementById('text-size');
      function setBar() {
        fill.style.width = `${slider.value}%`;
        slider.setAttribute('value', `${slider.value}`);
        text_size.innerHTML = `Text size ${slider.value}`;
      }
      slider.addEventListener("input", setBar);
      setBar();

    };

    main_handle();

  }, []);



  return (
    <>
      <div id="postbar">

        <div className="postbar-container is_hide">
          <span id="close-postbar-dialog" className="close"> &#10006; </span>

          <div className="postbar-body display-inline-flex">
            <div className="col-sm-8">

              <div className="display-inline-flex">
                <h4>Create new post</h4>
                <select className="postbar-select" id="select-post-type">
                  <option className="postbar-option" selected disabled>Choose post type</option>
                  <option className="postbar-option" value="news">News</option>
                  <option className="postbar-option" value="qestion">Question</option>
                  <option className="postbar-option" value="vote">Vote</option>
                  <option className="postbar-option" value="event">Event</option>
                </select>
              </div>
              <div className="display-inline-flex">
                <button id="postbar-tag-btn-1" className="postbar-tag-btn" type="button">Photos/Videos</button>
                <button id="postbar-tag-btn-2" className="postbar-tag-btn" type="button">Content</button>
                <button id="postbar-tag-btn-3" className="postbar-tag-btn" type="button">Format</button>
                <button id="postbar-tag-btn-4" className="postbar-tag-btn" type="button">More</button>
              </div>
              <hr />
              <div className="postbar-tag-1 postbar-show-tag">
                <div id="media-review">
                  <Dropzone
                    uploadUrl="/multi-upload"
                    label="Dropzone"
                    id="dropzone-uploader"
                    passData={onImgChange}    //passData là props với tham số truyền vào là hàm, dùng để nhận data từ child component gửi về
                    user_id={user_id}
                    imgs={imgs}
                  />
                </div>
              </div>
              <div className="postbar-tag-2">
                <textarea id="postbar-content" onChange={onContentChange} id="postbar-content" placeHolder="type your content/status here" rows="7" className="input-text"></textarea>
              </div>
              <div className="postbar-tag-3">
                <p id="text-size"></p>
                <div className="slider-container">
                  <span className="bar"><span className="fill"></span></span>
                  <input onChange={onFormatChange} type="range" id="slider" className="slider" min="0" max="100" />
                </div>
                {/* <p><br />Choose background color for content</p>
              <ChromePicker /> */}
              </div>
              <div className="postbar-tag-4">
                <button className="postbar-tag-btn" type="button">Add feeling</button>
                <button className="postbar-tag-btn" type="button">Tag people</button>
                <button className="postbar-tag-btn" type="button">Check-in</button>
                <button className="postbar-tag-btn" type="button">Life event</button>
                <button className="postbar-tag-btn" type="button">Vote list</button>
                <button className="postbar-tag-btn" type="button">Question list</button>
                <button className="postbar-tag-btn" type="button">Event address</button>
                <button className="postbar-tag-btn" type="button">Audio</button>
                <button className="postbar-tag-btn" type="button">Files</button>
              </div>

              {
                (news_id === '') ? <button className="postbar-btn" type="button" id="postbar-btn-add-post">POST</button> : <button className="postbar-btn" type="button" id="postbar-btn-update-post">UPDATE POST</button>
              }
            </div>


            <div className="col-sm-4">
              <Card_review btn_id="" className="card2-wrap-review" user_name={user_name} status={content_review} image={imgsrc} video={videosrc} avatar={user_avatar} format_review={format_review} />    {/*do là card review nên set cố định btn_id='' để ko hiển thị nút*/}
            </div>


          </div>


        </div>
      </div>
    </>
  )
};


//xem lại lúc add post hay update post thì cho trả về data của đúng post đó (ko lấy data cái mới nhất vì còn nhiều ng dùng khác đăng cùng thời điểm)