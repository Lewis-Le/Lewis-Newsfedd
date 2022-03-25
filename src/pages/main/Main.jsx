import React, { useEffect, useState } from 'react';
import '../main/Main.scss';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { socket } from "../../service/socket";
import Parallax from 'react-rellax';
import Navbar from '../../components/Navbarall';
import Postbar from '../../components/Postbar';
import DeleteDialog from '../../components/DeleteDialog';
import Navbarbot from '../../components/Navbarbot';
import Sidebar from '../../components/Sidebar';
import Card from '../../components/Card';
import Card2 from '../../components/Card2';
import Chat from '../../components/Chat_component/Chat/Chat';

import icon_add_post from '../../icons/add.png'


function Main({ user }) {

    const [news_id_for_delete, setIdDeleteDialog] = useState();
    const [news_id_for_edit, setIdEditDialog] = useState('');
    const [i, setI] = useState(0);

    useEffect(() => {

        var i = 0;
        var news_data = undefined;
        const API = axios.create({
            baseURL: '/process'
        });


        //Event khi cuộn trang đến cuối thì load_more_card()
        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            //console.log( { scrollTop, scrollHeight, clientHeight });
            if ((scrollTop >= scrollHeight / 2) || (clientHeight + scrollTop >= scrollHeight - 5)) {
                API.get(`/news/all/${i + 3}`, {
                })
                    .then(function (response) {
                        news_data = response.data;
                        //console.log(news_data);
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


        //Event auto play/pause video trong lúc scroll
        // let options = {
        //     root: null,
        //     rootMargin: '0px',
        //     threshold: 1.0
        // };
        // let callback = (entries, observer) => {
        //     entries.forEach(entry => {
        //         if (entry.target.id == 'myVideo') {
        //             if (entry.isIntersecting) {
        //                 entry.target.play();
        //             }
        //             else{
        //                 entry.target.pause();
        //             }
        //         }
        //     });
        // };
        // let observer = new IntersectionObserver(callback, options);
        // observer.observe(document.querySelector('#myvideo'));




        function inti_page() {
            API.get(`/news/all/6`, {
            })
                .then(function (response) {
                    news_data = response.data;
                    //console.log(i);
                    try {
                        load_more_card(i);
                        i = i + 1;
                    }
                    catch (err) {
                        //console.log(err);
                    };
                    try {
                        load_more_card(i);
                        i = i + 1;
                    }
                    catch (err) {
                        //console.log(err);
                    };
                    try {
                        load_more_card(i);
                        i = i + 1;
                    }
                    catch (err) {
                        //console.log(err);
                    };
                    try {
                        load_more_card(i);
                        i = i + 1;
                    }
                    catch (err) {
                        //console.log(err);
                    };
                    try {
                        load_more_card(i);
                        i = i + 1;
                    }
                    catch {
                        //console.log('Cant load more card');
                    };
                    try {
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
            let video_src = `/${news_data[i].news_type.video[0]}`;
            let image_url = `/${news_data[i].news_type.image[0]}`;
            let avatar = `/${news_data[i].user_avatar}`;
            let btn_id = '';
            // let i_rand = getRandomInt(10);
            // let video_src2 = `/${news_data[i_rand].news_type.video[0]}`;
            // let image_url2 = `/${news_data[i_rand].news_type.image[0]}`;
            // let avatar2 = `/${news_data[i_rand].user_avatar}`;
            // let i_rand2 = getRandomInt(10);
            // let video_src3 = `/${news_data[i_rand2].news_type.video[0]}`;
            // let image_url3 = `/${news_data[i_rand2].news_type.image[0]}`;
            // let avatar3 = `/${news_data[i_rand2].user_avatar}`;
            //kiểm tra có phải bài post của user đang đăng nhập hiện tại không:
            if (news_data[i].user_id === user.Id) {
                btn_id = news_data[i].Id;   //nếu trùng thì pass dữ liệu là id(của news i) của bài post qua cho Component Card
            };
            ReactDOM.render(
                <React.StrictMode>
                    <div id={news_data[i].Id} className="card-2">
                        <Parallax speed={0}>
                            <Card2 btn_id={btn_id} post_id={news_data[i].Id} user_current_id={user.Id} className="card2-wrap" user_name={news_data[i].user_name} status={news_data[i].news_type.status} image={image_url} video={video_src} avatar={avatar} date={news_data[i].created} liked={news_data[i].liked} haha={news_data[i].haha} btn_delete_news_handle={btn_delete_news_handle} btn_edit_news_handle={btn_edit_news_handle} index={i} />
                        </Parallax>
                    </div>
                    {/* <div className="card-1">
                        <Parallax speed={2} offset={0}>
                            <Card btn_id={btn_id} className="card1-wrap" user_name={news_data[i_rand2].user_name} status={news_data[i_rand2].news_type.status} image={image_url3} video={video_src3} avatar={avatar3} date={news_data[i_rand2].created} index={i_rand2} />
                        </Parallax>
                    </div>
                    <div className="card-3">
                        <Parallax speed={8} offset={0}>
                            <Card btn_id={btn_id} className="card-wrap" user_name={news_data[i_rand].user_name} status={news_data[i_rand].news_type.status} image={image_url2} video={video_src2} avatar={avatar2} date={news_data[i_rand].created} index={i} />
                        </Parallax>
                    </div> */}
                </React.StrictMode>,
                document.getElementById(`some-cards${i}`)
            );
        };

        inti_page();



        //phần socket lắng nghe sự kiện
        socket.on("broad-online-status", user_name => {
            console.log(`${user_name} vừa mới online`);
        });

        socket.on("broad-add-new-post", postData => {
            console.log(`${postData.user_name} vừa mới đăng bài post mới`);
            load_latest_card(i, postData);
        });

        socket.on("broad-delete-post", news_id => {
            passData_remove_post(news_id);
        });

    }, []);




    //hàm tạo số nguyên ngẩu nhiên từ 0 đến max
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    };


    //hàm load latest cards
    function load_latest_card(i, news_data) {
        var div_cards = document.getElementById('cards');
        var some_cards = document.createElement('div');
        some_cards.setAttribute('id', `some-cards${i}`);
        div_cards.prepend(some_cards);
        let video_src = `/${news_data[0].news_type.video[0]}`;
        let image_url = `/${news_data[0].news_type.image[0]}`;
        let avatar = `/${news_data[0].user_avatar}`;
        //kiểm tra có phải bài post của user đang đăng nhập hiện tại không:
        let btn_id = '';
        if (news_data[0].user_id === user.Id) {
            btn_id = news_data[0].Id;   //nếu trùng thì pass dữ liệu là id(của news i) của bài post qua cho Component Card
        };
        ReactDOM.render(
            <React.StrictMode>
                <div id={news_data[0].Id} className="card-2">
                    <Parallax speed={0}>
                        <Card2 btn_id={btn_id} post_id={news_data[0].Id} user_current_id={user.Id} className="card2-wrap" user_name={news_data[0].user_name} status={news_data[0].news_type.status} image={image_url} video={video_src} avatar={avatar} date={news_data[0].created} liked={news_data[0].liked} haha={news_data[i].haha} btn_delete_news_handle={btn_delete_news_handle} btn_edit_news_handle={btn_edit_news_handle} index={0} />
                    </Parallax>
                </div>
            </React.StrictMode>,
            document.getElementById(`some-cards${i}`)
        );
        //setI(i + 1);
    };


    //phần hàm xử lý nút bấm hiện delete dialog và nhận data news_id từ Card2 pass qua để pass lại cho DeleteDialog component
    function btn_delete_news_handle(news_id) {
        let rand = `${getRandomInt(9)}${getRandomInt(9)}${getRandomInt(9)}${getRandomInt(9)}${getRandomInt(9)}`;
        setIdDeleteDialog(`${rand}${news_id}`);
    };

    //phần hàm xử lý nút bấm hiện edit dialog và nhận data news_id từ Card2 pass qua để pass lại cho Postbar component
    function btn_edit_news_handle(news_id) {
        setIdEditDialog(`${news_id}`);
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

    //phần xóa postData mỗi lần bấm nút close trên postbar
    function passData_remove_postData(news_id){
        setIdEditDialog('');    //set lại news_id của postbar thành rỗng để khi nhấn add new post thì sẽ ko còn data cũ (cho biết đây là add new post chớ ko phải là edit post)
    }


    return (
        <>
            <div className="row">

                <div className="col-sm-2">
                    <Sidebar />
                    <Navbar />
                    <button type='button' className="show-postbar-btn"><img className="btn-icon" src={icon_add_post} /> </button>
                    {/* <div className="outerChat-container">
                        <Chat name={user.user_name} room={'1'} />
                    </div> */}
                </div>

                <div className="col-sm-8">
                    <Navbarbot avatar={`/${user.user_avatar}`} user_current_id={user.Id} />
                    <Postbar news_id={news_id_for_edit} user_name={user.user_name} user_avatar={`/${user.user_avatar}`} user_id={user.Id} user={user} passData_remove_postData={passData_remove_postData} passData_load_latest_card={load_latest_card} />
                    <DeleteDialog news_id={news_id_for_delete} user_name={user.user_name} user_avatar={`/${user.user_avatar}`} user_id={user.Id} passData_remove_post={passData_remove_post} />
                    <div style={{ position: 'fixed', height: '9%' }}></div>
                    <div id="cards"></div>
                </div>

            </div>

        </>
    );
};


export default Main;


// xem lại phần load_latest_card, khi post bài mới xong thì chưa tăng biến i được