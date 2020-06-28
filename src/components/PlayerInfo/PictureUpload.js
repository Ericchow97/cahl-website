import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

export const PictureUpload = (props) => {
  const [ imageUrl, setImageURL ] = useState()
  const [ uploading, setUploading ] = useState(false)

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const beforeUpload = (file) => {
    const isAcceptableType = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/tiff" || file.type === "image/gif";
    if (!isAcceptableType) {
      message.error("You can only upload JPG/PNG/TIFF/GIF files!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isAcceptableType && isLt2M;
  }

  const handleChange = info => {
    const { status } = info.file;
    if (status === 'uploading') {
      props.setImage(info.file)
      setUploading(true)
      return;
    }
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, imageUrl => {
      setImageURL(imageUrl)
      setUploading(false)
    });
  };

  return (
    <>
      {imageUrl && <img src={imageUrl} alt="avatar" className='circle-img' style={{marginTop: '0px', marginBottom: '25px'}} />}
      <Dragger 
        name='file'
        showUploadList={false}
        className="avatar-uploader"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        <p className="ant-upload-drag-icon">
          {uploading ? <LoadingOutlined /> : <InboxOutlined />}
        </p>
        <p className="ant-upload-text" style={{color: 'black'}}>Click or drag file to this area to upload</p>
        <p className="ant-upload-hint" style={{color: 'black'}}>
          Please upload a single .jpg, .png, .tif, or .gif file
        </p>
      </Dragger>
    </>
  )
}
