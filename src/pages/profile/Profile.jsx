import React, { useEffect, useState } from 'react';
import '../profile/profile.scss'
import ReactDOM from 'react-dom';
import axios from 'axios';
import Parallax from 'react-rellax';
import Navbar from '../../components/Navbarall';
import Postbar from '../../components/Postbar';
import DeleteDialog from '../../components/DeleteDialog';
import Navbarbot from '../../components/Navbarbot';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Card2 from '../../components/Card2';
import Featured from '../../components/featured/Featured';

import icon_add_post from '../../icons/add.png'


function Profile_privite({ user }) {

    const [news_id_for_delete, setIdDeleteDialog] = useState();
    //const [news_data, setNewsData] = useState();

    useEffect(() => {

        var i = 0;
        var news_data_profile_privite = undefined;
        const API = axios.create({
            baseURL: '/process'
        });

        //hàm tạo số nguyên ngẩu nhiên từ 0 đến max
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        };

        //Event khi cuộn trang đến cuối thì load_more_card()
        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            //console.log( { scrollTop, scrollHeight, clientHeight });
            if ((scrollTop >= scrollHeight / 2) || (clientHeight + scrollTop >= scrollHeight - 5)) {
                API.get(`/news/${user.Id}/${i + 10}`, {
                })
                    .then(function (response) {
                        news_data_profile_privite = response.data;
                        //console.log(news_data_profile_privite);
                        try {
                            load_more_card(i);
                            i = i + 1;
                            load_more_card(i);
                            i = i + 1;
                            load_more_card(i);
                            i = i + 1;
                        }
                        catch {
                            //console.log('Cant load more card');
                        };
                    })
                    .catch(function (error) {
                        //console.log(error);
                    });
            };
        });

        function inti_page() {
            API.get(`/news/${user.Id}/10`, {
            })
                .then(function (response) {
                    news_data_profile_privite = response.data;
                    console.log(response.data);
                    try {
                        load_more_card(i);
                        i = i + 1;
                        load_more_card(i);
                        i = i + 1;
                        load_more_card(i);
                        i = i + 1;
                        load_more_card(i);
                        i = i + 1;
                        load_more_card(i);
                        i = i + 1;
                    }
                    catch {
                        //console.log('Cant load more card');
                    };
                })
                .catch(function (error) {
                    //console.log(error);
                });
        };

        //hàm load thêm cards
        function load_more_card(i) {
            var div_cards = document.getElementById('cards');
            var some_cards = document.createElement('div');
            some_cards.setAttribute('id', `some-cards${i}`);
            div_cards.append(some_cards);
            let video_src = `/${news_data_profile_privite[i].news_type.video[0]}`;
            let image_url = `/${news_data_profile_privite[i].news_type.image[0]}`;
            let avatar = `/${news_data_profile_privite[i].user_avatar}`;
            let btn_id = '';
            let i_rand = getRandomInt(i + 10);
            let video_src2 = `/${news_data_profile_privite[i_rand].news_type.video[0]}`;
            let image_url2 = `/${news_data_profile_privite[i_rand].news_type.image[0]}`;
            let avatar2 = `/${news_data_profile_privite[i_rand].user_avatar}`;
            let i_rand2 = getRandomInt(i + 15);
            let video_src3 = `/${news_data_profile_privite[i_rand2].news_type.video[0]}`;
            let image_url3 = `/${news_data_profile_privite[i_rand2].news_type.image[0]}`;
            let avatar3 = `/${news_data_profile_privite[i_rand2].user_avatar}`;
            //kiểm tra có phải bài post của user đang đăng nhập hiện tại không:
            if (news_data_profile_privite[i].user_id === user.Id) {
                btn_id = news_data_profile_privite[i].Id;   //nếu trùng thì pass dữ liệu là id(của news i) của bài post qua cho Component Card
            };
            ReactDOM.render(
                <React.StrictMode>
                    <div className="card-2">
                        <Parallax speed={0}>
                            <Card2 btn_id={btn_id} className="card2-wrap" user_name={news_data_profile_privite[i].user_name} status={news_data_profile_privite[i].news_type.status} image={image_url} video={video_src} avatar={avatar} date={news_data_profile_privite[i].created} btn_delete_news_handle={btn_delete_news_handle} index={i} />
                        </Parallax>
                    </div>
                    {/* <div className="card-1">
                        <Parallax speed={2} offset={0}>
                            <Card btn_id={btn_id} className="card1-wrap" user_name={news_data_profile_privite[i_rand2].user_name} status={news_data_profile_privite[i_rand2].news_type.status} image={image_url3} video={video_src3} avatar={avatar3} date={news_data_profile_privite[i_rand2].created} index={i_rand2} />
                        </Parallax>
                    </div>
                    <div className="card-3">
                        <Parallax speed={8} offset={0}>
                            <Card btn_id={btn_id} className="card-wrap" user_name={news_data_profile_privite[i_rand].user_name} status={news_data_profile_privite[i_rand].news_type.status} image={image_url2} video={video_src2} avatar={avatar2} date={news_data_profile_privite[i_rand].created} index={i} />
                        </Parallax>
                    </div> */}
                </React.StrictMode>,
                document.getElementById(`some-cards${i}`)
            );
        };


        //hàm load latest cards
        function load_latest_card(i, news_data_profile_privite) {
            var div_cards = document.getElementById('cards');
            var some_cards = document.createElement('div');
            some_cards.setAttribute('id', `some-cards${i}`);
            div_cards.prepend(some_cards);
            let video_src = `/${news_data_profile_privite[0].news_type.video[0]}`;
            let image_url = `/${news_data_profile_privite[0].news_type.image[0]}`;
            let avatar = `/${news_data_profile_privite[0].user_avatar}`;
            //kiểm tra có phải bài post của user đang đăng nhập hiện tại không:
            let btn_id = '';
            if (news_data_profile_privite[0].user_id === user.Id) {
                btn_id = news_data_profile_privite[0].Id;   //nếu trùng thì pass dữ liệu là id(của news i) của bài post qua cho Component Card
            };
            ReactDOM.render(
                <React.StrictMode>
                    <div className="card-2">
                        <Parallax speed={0}>
                            <Card2 btn_id={btn_id} className="card2-wrap" user_name={news_data_profile_privite[0].user_name} status={news_data_profile_privite[0].news_type.status} image={image_url} video={video_src} avatar={avatar} date={news_data_profile_privite[0].created} btn_delete_news_handle={btn_delete_news_handle} index={0} />
                        </Parallax>
                    </div>
                </React.StrictMode>,
                document.getElementById(`some-cards${i}`)
            );
        };


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
                            news_data_profile_privite = response.data;
                            //console.log(news_data);
                            load_latest_card(i, response.data);
                            i = i + 1;
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
            };

        };
        inti_page();
        main_handle();

    }, []);


    //phần hàm xử lý nút bấm hiện delete dialog và nhận data news_id từ Card2 pass qua để pass lại cho DeleteDialog component
    function btn_delete_news_handle(news_id) {
        setIdDeleteDialog(news_id);
    };

    //phần xóa div post trên ui khi remove xong (cũng là hàm nhận data pass qua từ child DeleteDialog);
    function passData_remove_post(news_id) {
        //console.log(news_id);
        try {
            //console.log(`trong try`);
            let remove_post = document.getElementById(news_id);
            //remove_post.classList.remove('show-postbar');
            remove_post.classList.add('removed-card');                  //muốn hiện animation thì cần dùng hàm addClass, ko dùng element.style.<> vì nó chỉ chạy 1 lần duy nhất lúc khởi tạo và đã chạy rồi, nếu muốn chạy lại thì tạo class style mới rồi tùy chỉnh animation trong đó, xong addClass để chạy hoặc removeClass để tắt (giống như hộp thoại postbar)
            remove_post.addEventListener('transitionend', function () {
                //remove_post.style.display = 'none';
                remove_post.remove();
            });
        }
        catch (err) {
            console.log(err);
        }
    };


    return (
        <>
            <div className="row">

                <div className="col-sm-2">
                    <Navbar />

                    <button type='button' className="show-postbar-btn show-postbar-btn-profile-page"><img className="btn-icon" src={icon_add_post} /></button>
                </div>

                <div className="col-sm-8">
                    <Navbarbot avatar={`/${user.user_avatar}`} />
                    <Featured avatar={`/${user.user_avatar}`} user_name={user.user_name} />
                    <Postbar user_name={user.user_name} user_avatar={`/${user.user_avatar}`} user_id={user.Id} />
                    <DeleteDialog news_id={news_id_for_delete} user_name={user.user_name} user_avatar={`/${user.user_avatar}`} user_id={user.Id} passData_remove_post={passData_remove_post} />
                    <div style={{ position: 'fixed', height: '9%' }}></div>

                    <Parallax speed={0}>
                        <div className="profile-page-main-menubar">
                            <h2 className="profile-page-main-menubar-li">Posts</h2>
                            <h2 className="profile-page-main-menubar-li">Photos</h2>
                            <h2 className="profile-page-main-menubar-li">Videos</h2>
                            <h2 className="profile-page-main-menubar-li">Profolio</h2>
                            <h2 className="profile-page-main-menubar-li">My work</h2>
                        </div>
                        <hr className="profile-menubar-underline" />
                    </Parallax>

                    <div style={{ paddingLeft: '320px', marginTop: '-270px' }} id="cards"></div>

                </div>


                <div className="col-sm-2">
                </div>

            </div>

            <div className="row">
            </div>
        </>
    );
};


export default Profile_privite;




//useEffect chưa cleanup nên khi post liên tiếp 2 news trở lên mà ko load lại trang thì khi xóa 1 news bất kỳ trong số đó thì dẫn đến các news khác(các news đăng liên tục cùng news bị xóa) sẽ bị xóa theo
//cũng do useEffect chưa cleanup nên khi đăng post mới sẽ gặp tình trạng duplicate
//do render component trễ 1 chu kỳ biến giá trị nên undefined read props style of null để add anamation khi remove post