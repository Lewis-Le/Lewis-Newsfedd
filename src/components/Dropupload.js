import { Progress } from 'reactstrap';
import _ from 'lodash';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import uplodIcon from './upload.png';
import './Dropzone.css';
import { useMemo } from 'react/cjs/react.development';

const API = axios.create({
    baseURL: '/process'
});

function Progress_bar({ value }) {
    return (
        <>
            <div className="progressbar-container">
                <div className="progressbar-complete" style={{ width: `${value}%` }}>
                    <div className="progressbar-liquid"></div>
                </div>
                <span className="progress">{value}%</span>
            </div>
        </>
    );
}

export default function Dropzone(props) {
    let { id, label, uploadUrl, passData, user_id, imgs } = props;
    const [isUploding, setUploding] = useState(false);
    const [uploadedImgs, setUplodedImgs] = useState();      //nếu ko có giá trị thì imgs = [] => đây là post new news, ngược lại là edit news
    const [uploadProgress, setProgress] = useState(0);

    useMemo(() => {
        setUplodedImgs(imgs);
        passData(imgs);
    }, [imgs]);

    
    const handleChange = async e => {
        let { files } = e.target;

        let formData = new FormData();
        formData.append('user_id', user_id);

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
        setUplodedImgs(uploadedImgs.concat(data));
        setUploding(false);
        //Hàm gửi data qua cho parent (gửi url img, video)
        // if(typeof uploadedImgs === 'undefined'){
        passData(data); //trường hợp khi mới up 1 img/video thì uploadedImgs=undefined vì chưa concat(data) vào
        //}
        // else if(typeof uploadedImgs != 'undefined'){
        //     passData(uploadedImgs[0])   //trường hợp từ 2 img/video trở lên thì lấy cái đầu tiên hiển thị
        // };

    };

    function delete_review(e) {
        let item = e.target;
        try {
            //console.log(`uploadedimgs: ${uploadedImgs}`);
            setUplodedImgs(uploadedImgs.filter(v => v !== e.target.src.slice(21)));     //slice(21) để xóa phần http://localhost:3000
            passData(uploadedImgs.filter(v => v !== e.target.src.slice(21)));
            item.style.display = 'none';  //xóa tag img/viseo tương ứng trong dropzone
        }
        catch (err) {
            console.log(err);
        }
    };

    function setNullInput(e) {   //để có thể up lại media vừa mới xóa (chọn lại file trùng với file đã chọn)
        e.target.value = null;
    };


    return (
        <div className="form-group">
            <label htmlFor={id} className="text-primary font-weight-bold">{label}</label>
            <div className="dropzone-container is_hide">
                <div className="dropzone-uploader-mask">
                    <img className="file-uploader-icon" src={uplodIcon} alt="Upload-Icon" />
                </div>
                <input className="dropzone-input" type="file" multiple="multiple" id={id} onClick={setNullInput} accept="image/*, video/mp4" onChange={handleChange} />
                <div className="img-review">
                    {
                        uploadedImgs && !isUploding ? (
                            uploadedImgs.map(uploadedImg => {
                                if (uploadedImg.includes('.mp4')) {
                                    return (<video onClick={delete_review} src={uploadedImg} className="uploaded-video" autoPlay muted></video>);
                                }
                                else if (!uploadedImg.includes('.mp4')) {
                                    return (<img onClick={delete_review} src={uploadedImg} key={uploadedImg} alt="UploadedImage" className="uploaded-img" />);
                                };
                            })
                        ) : null
                    }
                </div>
            </div>
            {
                isUploding ? (
                    <div className="dropzone-loading">
                        <div className="text-center">{uploadProgress}%</div>
                        <Progress_bar value={uploadProgress} />
                    </div>
                ) : null
            }

        </div>
    )
};