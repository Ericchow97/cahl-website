import React, { useState } from 'react'
import { Row, Col } from 'antd';
import { TeamAdminView } from '../Admin/TeamAdminView'

export const SeriesAdminView = (props) => {
  const [team1PlayerName, setTeam1PlayerName] = useState('')
  const [team2PlayerName, setTeam2PlayerName] = useState('')

  //TODO: Update dropdown when name is selected, see if you can use getfields from ant FORM

  // updates the targets name for adding a new player to player list
  const onNameChange = (event, num) => {
    // update team1name
    if (num === 1) {
      setTeam1PlayerName(event.target.value)
    }
    // update team2name
    else if (num === 2) {
      setTeam2PlayerName(event.target.value)
    }
  }

  // add player to the list of players
  const addNewPlayer = (num) => {
    props.setPlayerListId(playerListId => playerListId + 1)
    if (num === 1) {
      // newPlayer key indicates person was just addded to the system
      props.setAllPlayers(allPlayers => [...allPlayers, { id: props.playerListId, name: team1PlayerName, newPlayer: true }])
      props.setPlayerList(playerList => [...playerList, team1PlayerName])
      setTeam1PlayerName('')
    } else {
      props.setAllPlayers(allPlayers => [...allPlayers, { id: props.playerListId, name: team2PlayerName, newPlayer: true }])
      props.setPlayerList(playerList => [...playerList, team2PlayerName])
      setTeam2PlayerName('')
    }
  }

  // remove only newPlayers from the list
  const removeNewPlayer = (e, playerName) => {
    e.stopPropagation()
    props.setAllPlayers(allPlayers => allPlayers.filter(player => player.name !== playerName))
    props.setPlayerList(playerList => playerList.filter(player => player !== playerName))
  }

  return (
    <>
      <Row>
        <Col xs={24} lg={12}>
          <h1>{props.team1Name ? props.team1Name : 'Team 1'}</h1>
          <TeamAdminView
            teamNum={1}
            allPlayers={props.allPlayers}
            teamList={props.teamList}
            playerList={props.playerList}
            playerName={team1PlayerName}
            onNameChange={onNameChange}
            addNewPlayer={addNewPlayer}
            removeNewPlayer={removeNewPlayer}
            handleChange={props.handleChange}
            gameStatsView={props.gameStatsView}
            formRef={props.formRef}
          />
        </Col>
        <Col xs={24} lg={12}>
          <h1>{props.team2Name ? props.team2Name : 'Team 2'}</h1>
          <TeamAdminView
            teamNum={2}
            allPlayers={props.allPlayers}
            teamList={props.teamList}
            playerList={props.playerList}
            playerName={team2PlayerName}
            onNameChange={onNameChange}
            addNewPlayer={addNewPlayer}
            removeNewPlayer={removeNewPlayer}
            handleChange={props.handleChange}
            gameStatsView={props.gameStatsView}
            formRef={props.formRef}
          />
        </Col>
      </Row>
    </>
  );
}