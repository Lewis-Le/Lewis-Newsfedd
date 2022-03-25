import './Card.css';

function Card({user_name, avatar, status, date, image, video, className}) {

  let is_display_video = 'card-not-display';
  let is_display_image = 'card-not-display';
  if(!video.includes('undefined') && image.includes('undefined')){       //chỉ có video
    is_display_video = 'card-display';
    is_display_image = 'card-not-display';
  }
  else if(video.includes('undefined') && !image.includes('undefined')){      //chỉ có images
    is_display_video = 'card-not-display';
    is_display_image = 'card-display';
  }
  else if(!video.includes('undefined') && !image.includes('undefined')){      //có cả img và video
    is_display_video = 'card-display';
    is_display_image = 'card-display';
  };

  return (
    <div className={className}>
      <header className="w3-container">
        <br />
        <h4> <img className="round-avatar-card" src={avatar}/> {user_name} </h4>
        <p style={{fontSize: '11px', marginLeft: '12%', marginTop: '-5%'}}> {date} </p>
        
        <video className={is_display_video} src={video} muted controls></video>
        
        <img className={`w3-left w3-margin-right ${is_display_image}`} src={image} />
        <p> {status} </p>
      </header>
      
    </div>
  );
}

export default Card;
