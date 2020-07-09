import React, { useState, useEffect } from 'react'
import { Row, Col } from 'antd';
import { TeamAdminView } from '../Admin/TeamAdminView'

export const SeriesAdminView = (props) => {
  const [playerDropdownList, setPlayerDropdownList] = useState([])
  const [previousPlayers, setPreviousPlayers] = useState({})
  const [team1PlayerName, setTeam1PlayerName] = useState('')
  const [team2PlayerName, setTeam2PlayerName] = useState('')
  const [team1Disabled, setTeam1Disabled] = useState(true)
  const [team2Disabled, setTeam2Disabled] = useState(true)


  useEffect(() => {
    // on load, filter the drop down list based on the initial team players
    const newPlayers = props.form.getFieldsValue()
    let allPlayersCopy = [...props.allPlayers]
    const teamPlayersArray = ['Team1Players', 'Team2Players']
    for (let i = 0; i < teamPlayersArray.length; i++) {
      for (let j = 0; j < newPlayers[teamPlayersArray[i]].length; j++) {
        if (newPlayers[teamPlayersArray[i]][j]) {
          allPlayersCopy = allPlayersCopy.filter(player => player.name !== newPlayers[teamPlayersArray[i]][j].name)
        }
      }
    }
    setPreviousPlayers(newPlayers)
    setPlayerDropdownList(allPlayersCopy)
  }, [props.allPlayers, props.form])

  const updateStarsDropdown = (oldName, name) => {
    // remove old player
    props.setStarsDropdownList(players => players.filter(player => player.player_name !== oldName))
    // add new player
    props.setStarsDropdownList(players => [...players, { player_name: name }])
  }

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

  // add player to the list of players
  const addNewPlayer = (num, playerInstance) => {
    // newPlayer key indicates person was just addded to the system
    let sanitized_name, newPlayers
    if (num === 1) {
      sanitized_name = team1PlayerName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
      newPlayers = props.form.getFieldValue('Team1Players')
      setTeam1PlayerName('')
    } else {
      sanitized_name = team2PlayerName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
      newPlayers = props.form.getFieldValue('Team2Players')
      setTeam2PlayerName('')
    }
    if (props.gameStatsView) {
      updateStarsDropdown(newPlayers[playerInstance].name, sanitized_name)
    }
    newPlayers[playerInstance].name = sanitized_name
    props.setAllPlayers(allPlayers => [...allPlayers, { name: sanitized_name, newPlayer: true }])
  }

  // remove only newPlayers from the list
  const removeNewPlayer = (e, playerName) => {
    e.stopPropagation()
    props.setAllPlayers(allPlayers => allPlayers.filter(player => player.name !== playerName))
    setPlayerDropdownList(players => players.filter(player => player.name !== playerName))
  }

  // add back previous player
  const addPreviousPlayer = (newPlayers, index, name, type = 'remove') => {
    const teamPlayersArray = ['Team1Players', 'Team2Players']
    for (let i = 0; i < teamPlayersArray.length; i++) {
      // only check if element exist in previous player array
      if (previousPlayers[teamPlayersArray[i]][index]) {
        // if there was a previous player, add player back into player dropdown list
        if (previousPlayers[teamPlayersArray[i]][index].name && (!newPlayers[teamPlayersArray[i]][index]
          || previousPlayers[teamPlayersArray[i]][index].name !== newPlayers[teamPlayersArray[i]][index].name)) {
          const oldPlayerIndex = props.allPlayers.findIndex(player => player.name === previousPlayers[teamPlayersArray[i]][index].name)
          setPlayerDropdownList(players => [...players, { name: previousPlayers[teamPlayersArray[i]][index].name, newPlayer: props.allPlayers[oldPlayerIndex].newPlayer }])
          if (props.gameStatsView && type === 'select') {
            updateStarsDropdown(previousPlayers[teamPlayersArray[i]][index].name, name)
          } else if (props.gameStatsView && type === 'remove') {
            props.setStarsDropdownList(players => players.filter(player => player.player_name !== previousPlayers[teamPlayersArray[i]][index].name))
          }
          return
        }
      } else {
        break
      }
    }
    // if there wasn't a previous player
    if (props.gameStatsView && type === 'select') {
      props.setStarsDropdownList(players => [...players, { player_name: name }])
    }
  }

  const onSelect = (name, index) => {
    const newPlayers = props.form.getFieldsValue()
    // remove new player from dropdown selection
    setPlayerDropdownList(players => players.filter(player => player.name !== name))
    addPreviousPlayer(newPlayers, index, name, 'select')
    setPreviousPlayers(newPlayers)
  }

  const removeExistingPlayer = (index) => {
    const newPlayers = props.form.getFieldsValue()
    addPreviousPlayer(newPlayers, index)
    setPreviousPlayers(newPlayers)
  }

  return (
    <>
      <Row>
        <Col xs={24} lg={12}>
          <h2>{props.team1Name || 'Team 1'}</h2>
          <TeamAdminView
            teamNum={1}
            playerDropdownList={playerDropdownList}
            onSelect={onSelect}
            teamList={props.teamList}
            playerName={team1PlayerName}
            buttonDisabled={team1Disabled}
            onNameChange={onNameChange}
            addNewPlayer={addNewPlayer}
            removeNewPlayer={removeNewPlayer}
            removeExistingPlayer={removeExistingPlayer}
            gameStatsView={props.gameStatsView}
            numGoalies={props.team1Goalies}
          />
        </Col>
        <Col xs={24} lg={12}>
          <h2>{props.team2Name || 'Team 2'}</h2>
          <TeamAdminView
            teamNum={2}
            playerDropdownList={playerDropdownList}
            onSelect={onSelect}
            teamList={props.teamList}
            playerName={team2PlayerName}
            buttonDisabled={team2Disabled}
            onNameChange={onNameChange}
            addNewPlayer={addNewPlayer}
            removeNewPlayer={removeNewPlayer}
            removeExistingPlayer={removeExistingPlayer}
            gameStatsView={props.gameStatsView}
            numGoalies={props.team2Goalies}
          />
        </Col>
      </Row>
    </>
  );
}