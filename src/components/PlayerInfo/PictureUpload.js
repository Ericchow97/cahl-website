import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined, LoadingOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

export const PictureUpload = (props) => {
  const [uploading, setUploading] = useState(false)

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
    return isAcceptableType;
  }

  const handleChange = info => {
    const { status } = info.file;
    // sets picture to be uploaded on DB
    if (status === 'uploading') {
      props.setImage(info.file)
      setUploading(true)
      return;
    }
    // display logic for uploaded picture
    if (status === 'error') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        props.setImageURL(imageUrl)
        setUploading(false)
      });
    }
  };

  return (
    <>
      {props.imageUrl && <img src={props.imageUrl} alt="avatar" className='circle-img' style={{ marginTop: '0px', marginBottom: '25px' }} />}
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
        <p className="ant-upload-text" style={{ color: 'black' }}>Click or drag file to this area to upload</p>
        <p className="ant-upload-hint" style={{ color: 'black' }}>
          Please upload a single .jpg, .png, .tif, or .gif file (Max: 2.5mb)
        </p>
      </Dragger>
    </>
  )
}
