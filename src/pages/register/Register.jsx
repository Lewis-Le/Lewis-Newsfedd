import { useRef } from "react";
import { useState, useEffect } from "react";
import "./register.scss";
import { Progress } from 'reactstrap';
import _ from 'lodash';
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000'
});

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [user_name, setUsername] = useState("");
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Join us');
  const [isUploding, setUploding] = useState(false);
  const [uploadedImgs, setUplodedImgs] = useState([]);
  const [uploadProgress, setProgress] = useState(0);
  const [not_visible, setVisible] = useState('not-visible');
  const [not_visibleI, setVisibleI] = useState('');
  const [check, setCheck] = useState('');

  const emailRef = useRef();
  const passwordRef = useRef();
  const uploadUrl="/process/multi-upload";

  useEffect(() => {
    console.log('useEffect has been called!');
    setEmail(email);
    setPassword(password);
    setCpassword(cpassword);
    setUplodedImgs(uploadedImgs);
    setUsername(user_name);
    setMessage(message);
    console.log(is_valid());
    if(is_valid()){
      setVisible(''); //xóa class not-visible để hiện nút join us
      setMessage(''); //xóa hết các message
    }
    else if(!is_valid()){
      setVisible('not-visible'); //add class not-visible để ẩn nút join us
    };
  });

  const handleEmail = (e) => {
    setEmail(e.target.value);
    if(e.target.value === ''){
      setMessage('Vui lòng không để trống email');
      setVisible('not-visible'); //add class not-visible để ẩn nút join us
    };
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    if(cpassword != e.target.value){
      setMessage('Mật khẩu chưa trùng khớp');
      setVisible('not-visible'); //add class not-visible để ẩn nút join us
    }
    else if(e.target.value === ''){
      setMessage('Vui lòng không để trống mật khẩu');
      setVisible('not-visible'); //add class not-visible để ẩn nút join us
    }
    else if(cpassword === e.target.value && e.target.value != ''){
      setMessage('Mật khẩu ok');
    };
    
  };

  const handleConfirmPassword = (e) => {
    setCpassword(e.target.value);
    if(password != e.target.value){
      setMessage('Mật khẩu chưa trùng khớp');
      setVisible('not-visible'); //add class not-visible để ẩn nút join us
    }
    else if(password === e.target.value && e.target.value != ''){
      setMessage('Mật khẩu ok');
    };
    
  };

  const handleName = (e) => {
    setUsername(e.target.value);
    if(e.target.value === ''){
      setMessage('Bạn cần nhập tên người dùng');
      setVisible('not-visible'); //add class not-visible để ẩn nút join us
    }
  };
  

  function is_valid(){
    console.log(user_name);
    console.log(email);
    console.log(password);
    console.log(cpassword);
    console.log(uploadedImgs[0]);
    if((user_name != '') && (email != '') && (password != '') && (uploadedImgs[0] != undefined) && (password === cpassword) && (!message.includes('Email')) && (email.includes('@'))){
      return true;
    }
    return false;
  };


  const handleChange = async e => {   //hàm để xử lý upload avatar
    let { files } = e.target;
    let formData = new FormData();

    _.forEach(files, file => {
      formData.append('files', file);     //'files' là keyvalue để post
    });

    setUploding(true);
    let { data } = await API.post(uploadUrl, formData, {
        onUploadProgress: ({ loaded, total }) => {
            let progress = ((loaded / total) * 100).toFixed(2);
            setProgress(progress);
        }
    });
    //console.log(data);
    setUplodedImgs(data);
    setUploding(false);
  };


  function delete_review(e){
    let item = e.target.src;
    setUplodedImgs(uploadedImgs.filter(v => v !== e.target.src));
    //console.log(uploadedImgs.filter(v => v !== e.target.src)[0]);
    try{
        item.parentNode.removeChild(item);  //xóa tag img/viseo tương ứng trong dropzone
    }
    catch{

    }
    setMessage('Vui lòng chọn ảnh đại diện');
    setVisible('not-visible'); //add class not-visible để ẩn nút join us
  };


  function setNullInput(e){
    e.target.value = null;
  };


  function handle_register(e){   //hàm xử lý đăng ký tài khoản, gửi data qua cho server
    e.preventDefault();
    if(is_valid()){
      let formData = {};
      formData.name = user_name;
      formData.main_email = email;
      formData.password = password;
      formData.avatar = uploadedImgs[0].slice(36);

      API.post('/signup', formData).then( function(res){
        console.log(res.data.message);
        setMessage(res.data.message);
        setVisible('not-visible');
        if(res.data.message.includes('Chúc mừng')){
          setVisibleI('not-visible');
          setVisible('not-visible');
          setTitle(res.data.message);
        };
      })
      .catch(function (error) {
        setMessage('Có  lỗi xảy ra, bạn vui lòng thử lại nhé');
      });
    }
    else if(!is_valid()){
      setMessage('Có  lỗi xảy ra, bạn vui lòng thử lại nhé');
    }
  };



  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <h2 className="login-page-title">Lewis Newsfeed welcome you</h2>
          
        </div>
      </div>
      <div className="container-register">
        <form>
          <h1>{title}</h1>
          <input className={`${not_visibleI}`} onChange={handleEmail} type="email" placeholder="Email" required/>
          <input className={`${not_visibleI}`} onChange={handlePassword} type="password" placeholder="Password" required/>
          <input className={`${not_visibleI}`} onChange={handleConfirmPassword} type="password" placeholder="Confirm password" required/>
          <input className={`${not_visibleI}`} onChange={handleName} type="text" placeholder="User name" required/>
          <div className={`choose-avatar ${not_visibleI}`}>
            <button className={`${not_visibleI}`} onChange={handleChange} className="SignupButton" type="button">Choose your avatar/profile video<input className={`${not_visibleI}`} style={{opacity: '0', position: 'absolute', marginLeft: '-140px', marginTop: '-12px'}} type="file" onClick={setNullInput} accept="image/*, video/mp4" required/></button>
            {
              uploadedImgs && !isUploding ? (
                  uploadedImgs.map(uploadedImg => {
                      if(uploadedImg.includes('.mp4')){
                          return (<video onClick={delete_review} src={uploadedImg} className="avatar" autoPlay muted></video>);
                      }
                      else if(!uploadedImg.includes('.mp4')){
                          return (<img onClick={delete_review} src={uploadedImg} key={uploadedImg} alt="UploadedImage" className="avatar" />);
                      };
                  })
              ) : null
            }
          </div>
          <button onClick={handle_register} type="submit" className={`loginButton ${not_visible} ${not_visibleI}`}>Join us</button>
          <small>
            <p> {message} </p>
            {
                isUploding ? (
                    <div className="flex-grow-1">
                        <div className="text-center">{uploadProgress}%</div>
                        <Progress value={uploadProgress} />
                    </div>
                ) : null
            }
          </small>
        </form>
      </div>
    </div>
  );
}
