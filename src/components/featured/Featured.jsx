//import { InfoOutlined, PlayArrow } from "@material-ui/icons";
import Parallax from 'react-rellax';
import "./featured.scss";


export default function Featured({ type, avatar, user_name }) {
  return (
    <div className="featured">

      <Parallax speed={0}>
        {/* <video
          autoPlay
          muted
          loop
          src="http://116.109.186.132:8000/videos/TestVFX11a7.mp4"
          alt=""
        /> */}
        <div className="profile-cover">
          <img className="profile-media-cover" src="/videos/cover.jpg" />
        </div>
        <div className="overlayer"></div>
      </Parallax>

      <div className="info">
        <span className="desc">
        </span>

        <Parallax speed={0}>
          <div className="card-main-info">
            <img className="user-avatar-card-main-info" src={avatar} />
            <h1 className="user-name-card-main-info">{user_name}</h1>  
            <p className="user-name-card-main-info">No body like you</p>
          </div>
        </Parallax>

        <Parallax speed={0}>
          <div className="card-main-details">
            <h1 className="title-card-main-details">About me</h1>
          </div>
          <div className="buttons">
            {/* <button className="play"> */}
            {/* <PlayArrow /> */}
            {/* <a style={{textDecoration: 'none', color: 'black'}} href="/watch/teaser"><span>Play teaser</span></a>
            </button> */}
          </div>
        </Parallax>

      </div>



    </div>
  );
}
