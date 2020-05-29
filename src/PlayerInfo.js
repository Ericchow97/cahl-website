import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import { CardTemplate } from './components/CardTemplate';
import { PlayerProfile } from './components/PlayerInfo/PlayerProfile'
import { PictureUpload } from './components/PlayerInfo/PictureUpload'
import { Button, Modal, message } from 'antd';

import { editPlayerImageFetch } from './components/Admin/PlayerFetchFunctions'

export const PlayerInfo = (props) => {
  let { playerId } = useParams()

  const [ visible, setVisible ] = useState(false);
  const [ loading, setLoading ] = useState(false)
  const [ image, setImage ] = useState()
  let fetchErr = false

  const showModal = () => {
    setVisible(true)
  }

  const handleOk = async () => {
    console.log(image.originFileObj)
    const formData = new FormData()
    formData.append("image", image.originFileObj)
    setLoading(true)
    try {
      // make a request to edit player image
      const res = await editPlayerImageFetch(formData, playerId)
      if (res.ok) {
        console.log('Success', await res.json())
      } else {
        throw new Error()
      }
    } catch {
      message.error("Server Error. Please refresh and try again");
      fetchErr = true
    }
    setLoading(false)
    if (fetchErr) {
      return
    }
    setVisible(false)
    message.success("Successfully uploaded picture");
    props.setSuccessfulSubmission(true)
  };

  const handleCancel = () => {
    setVisible(false)
  };


  //TODO: pop up modal screen to allow uploading of image
  return (
    <>
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" type="primary" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Update
          </Button>,
        ]}
      >
        <PictureUpload setImage={setImage}/>
      </Modal>
      <CardTemplate 
        header="Player Profile"
        loading={props.isLoading} 
        extra={true} 
        buttonText='Edit Player Image' 
        handleClick={showModal}
      >
        <PlayerProfile 
          players={props.players}
          playerId={playerId}
        />
      </CardTemplate>
    </>
  )
}
