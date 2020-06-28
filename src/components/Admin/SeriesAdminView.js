import React, { useState } from 'react'
import { Row, Col } from 'antd';
import { TeamAdminView } from '../Admin/TeamAdminView'

export const SeriesAdminView = (props) => {
  const [team1PlayerName, setTeam1PlayerName] = useState('')
  const [team2PlayerName, setTeam2PlayerName] = useState('')
  const [team1Disabled, setTeam1Disabled] = useState(true)
  const [team2Disabled, setTeam2Disabled] = useState(true)

  //TODO: Update dropdown when name is selected, see if you can use getfields from ant FORM

  // updates the targets name for adding a new player to player list
  const onNameChange = (event, num) => {
    // update team1name
    if (num === 1) {
      setTeam1PlayerName(event.target.value)
      setTeam1Disabled(event.target.value ? false : true)
    }
    // update team2name
    else if (num === 2) {
      setTeam2PlayerName(event.target.value)
      setTeam2Disabled(event.target.value ? false : true)
    }
  }

  //TODO: When adding player, automatically select the player too
  // add player to the list of players
  const addNewPlayer = (num) => {
    // newPlayer key indicates person was just addded to the system
    if (num === 1) {
      const sanitized_name = team1PlayerName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
      props.setAllPlayers(allPlayers => [...allPlayers, { name: sanitized_name, newPlayer: true }])
      setTeam1PlayerName('')
    } else {
      const sanitized_name = team2PlayerName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
      props.setAllPlayers(allPlayers => [...allPlayers, { name: sanitized_name, newPlayer: true }])
      setTeam2PlayerName('')
    }
  }

  // remove only newPlayers from the list
  const removeNewPlayer = (e, playerName) => {
    e.stopPropagation()
    props.setAllPlayers(allPlayers => allPlayers.filter(player => player.name !== playerName))
  }

  return (
    <>
      <Row>
        <Col xs={24} lg={12}>
          <h2>{props.team1Name || 'Team 1'}</h2>
          <TeamAdminView
            teamNum={1}
            allPlayers={props.allPlayers}
            teamList={props.teamList}
            playerName={team1PlayerName}
            buttonDisabled={team1Disabled}
            onNameChange={onNameChange}
            addNewPlayer={addNewPlayer}
            removeNewPlayer={removeNewPlayer}
            gameStatsView={props.gameStatsView}
            numGoalies={props.team1Goalies}
          />
        </Col>
        <Col xs={24} lg={12}>
          <h2>{props.team2Name || 'Team 2'}</h2>
          <TeamAdminView
            teamNum={2}
            allPlayers={props.allPlayers}
            teamList={props.teamList}
            playerName={team2PlayerName}
            buttonDisabled={team2Disabled}
            onNameChange={onNameChange}
            addNewPlayer={addNewPlayer}
            removeNewPlayer={removeNewPlayer}
            gameStatsView={props.gameStatsView}
            numGoalies={props.team2Goalies}
          />
        </Col>
      </Row>
    </>
  );
}