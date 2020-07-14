import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom'
import { CardTemplate } from './components/CardTemplate';
import { PlayerProfile } from './components/PlayerInfo/PlayerProfile'
import { PictureUpload } from './components/PlayerInfo/PictureUpload'
import { Input, Button, Modal, message } from 'antd';

import { editPlayerImageFetch, editPlayerImageFetchPublic } from './components/Admin/PlayerFetchFunctions'
import { fetchRequest } from './components/Admin/CommonFunctions'
import { Redirect } from 'react-router';
import { AdminContext } from './AdminContextProvider'

export const PlayerInfo = (props) => {
  let { playerId } = useParams()

  const adminContext = useContext(AdminContext)
  const [isAdminExpired, setAdminExpired] = useState(false)

  // Modal Variables
  const [visible, setVisible] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [image, setImage] = useState()
  const [playerName, setPlayerName] = useState('')
  const [playerNumber, setPlayerNumber] = useState('')
  const [playerNumberError, setPlayerNumberError] = useState(false)

  // Picture Upload State
  const [imageUrl, setImageURL] = useState()

  // Player Data Variables
  const [playerData, setPlayerData] = useState({})
  const [playerStatsData, setPlayerStatsData] = useState([])
  const [playerStatsLoading, setPlayerStatsLoading] = useState(true)
  const [invalidPlayer, setInvalidPlayer] = useState(false)

  useEffect(() => {
    // fetch to receive player data
    const fetchPlayerData = async (playerId) => {
      const playerStatsDataRes = await (await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/playerstats/?player_id=${playerId}`)).json()
      if (playerStatsDataRes.length) {
        setPlayerStatsData(playerStatsDataRes)
        setPlayerStatsLoading(false)
        setInvalidPlayer(false)
      } else {
        setInvalidPlayer(true)
      }
    }
    if (playerId) {
      fetchPlayerData(playerId)
    }
    // want to find the index of the player who was selected
    if (props.allPlayers.length) {
      const playerIndex = props.allPlayers.findIndex(player => player.id === parseInt(playerId))
      const playerData = props.allPlayers[playerIndex]
      if (playerData) {
        setPlayerData(playerData)
        setPlayerName(playerData.name)
        setPlayerNumber(playerData.num)
      }
    }
  }, [props.allPlayers, playerId])

  const handleOk = async () => {
    setModalLoading(true)
    let ret
    const formData = new FormData()
    if (image) {
      formData.append("image", image.originFileObj)
    }
    if (adminContext.isAdmin) {
      const sanitized_name = playerName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
      formData.append('name', sanitized_name)
      formData.append('num', Number.parseInt(playerNumber))
      ret = await fetchRequest(editPlayerImageFetch, adminContext, 'update', { data: formData, id: playerId })
    } else {
      ret = await fetchRequest(editPlayerImageFetchPublic, adminContext, 'update', { data: formData, id: playerId })
    }
    setModalLoading(false)
    if (!ret.success) {
      if (ret.error === 0) {
        setAdminExpired(true)
      }
      message.error(ret.message);
      return
    }
    setVisible(false)
    message.success(adminContext.isAdmin ? "Successfully updated player" : "Successfully uploaded picture");
    setImage()
    setImageURL()
    props.setSuccessfulSubmission(count => count + 1)
  };

  const showModal = () => {
    setVisible(true)
  }

  const handleCancel = () => {
    setVisible(false)
  };

  // ADMIN: Handle change of player name and number
  const handleChange = (e) => {
    const value = e.target.value
    if (e.target.id === 'name') {
      setPlayerName(value)
    } else {
      setPlayerNumber(value)
      setPlayerNumberError(isNaN(value) ? true : (parseFloat(value) | 0) !== parseFloat(value))
    }
  }

  if (invalidPlayer) {
    return <h1>This player does not exist</h1>
  } else {
    return (
      <>
        {isAdminExpired && <Redirect push to="/login" />}
        <CardTemplate
          header="Player Profile"
          loading={props.playersLoading || playerStatsLoading}
          extra={true}
          buttonText={adminContext.isAdmin ? 'Edit Player' : 'Edit Player Image'}
          handleClick={showModal}
        >
          <Modal
            title="Edit Image"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="cancel" type="primary" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" disabled={playerNumberError} loading={modalLoading} onClick={handleOk}>
                Update
              </Button>,
            ]}
          >
            <PictureUpload
              setImage={setImage}
              imageUrl={imageUrl}
              setImageURL={setImageURL}
            />
            {adminContext.isAdmin &&
              <>
                <p style={{ margin: '1em 0 0' }}>Name:</p>
                <Input id='name' value={playerName} onChange={(e) => handleChange(e)} autoComplete='off' />
                <p style={{ margin: '1em 0 0' }}>Number:</p>
                <Input id='number' value={playerNumber} onChange={(e) => handleChange(e)} autoComplete='off' />
                {playerNumberError &&
                  <p style={{ color: "red" }}>Invalid player number</p>
                }
              </>
            }
          </Modal>
          <PlayerProfile
            playerData={playerData}
            playerStatsData={playerStatsData}
          />
        </CardTemplate>
      </>
    )
  }
}
