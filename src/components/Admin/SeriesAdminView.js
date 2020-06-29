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
    for (let i = 0; i < newPlayers.Team1Players.length; i++) {
      allPlayersCopy = allPlayersCopy.filter(player => player.name !== newPlayers.Team1Players[i].name)
    }
    for (let i = 0; i < newPlayers.Team2Players.length; i++) {
      allPlayersCopy = allPlayersCopy.filter(player => player.name !== newPlayers.Team2Players[i].name)
    }
    setPreviousPlayers(newPlayers)
    setPlayerDropdownList(allPlayersCopy)
    console.log('ran')
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
    if (num === 1) {
      const sanitized_name = team1PlayerName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
      const newPlayers = props.form.getFieldValue('Team1Players')
      updateStarsDropdown(newPlayers[playerInstance].name, sanitized_name)
      newPlayers[playerInstance].name = sanitized_name
      props.setAllPlayers(allPlayers => [...allPlayers, { name: sanitized_name, newPlayer: true }])
      setTeam1PlayerName('')
    } else {
      const sanitized_name = team2PlayerName.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' ')
      const newPlayers = props.form.getFieldValue('Team2Players')
      updateStarsDropdown(newPlayers[playerInstance].name, sanitized_name)
      newPlayers[playerInstance].name = sanitized_name
      props.setAllPlayers(allPlayers => [...allPlayers, { name: sanitized_name, newPlayer: true }])
      setTeam2PlayerName('')
    }
  }

  // remove only newPlayers from the list
  const removeNewPlayer = (e, playerName) => {
    e.stopPropagation()
    props.setAllPlayers(allPlayers => allPlayers.filter(player => player.name !== playerName))
    setPlayerDropdownList(players => players.filter(player => player.name !== playerName))
  }

  const onSelect = (name) => {
    const newPlayers = props.form.getFieldsValue()
    for (let i = 0; i < previousPlayers.Team1Players.length; i++) {
      if (previousPlayers.Team1Players[i] !== newPlayers.Team1Players[i]) {
        setPlayerDropdownList(players => players.filter(player => player.name !== name))
        const oldPlayerIndex = props.allPlayers.findIndex(player => player.name === previousPlayers.Team1Players[i].name)
        setPlayerDropdownList(players => [...players, { name: previousPlayers.Team1Players[i].name, newPlayer: props.allPlayers[oldPlayerIndex].newPlayer }])
        updateStarsDropdown(previousPlayers.Team1Players[i].name, name)
        setPreviousPlayers(newPlayers)
        return
      }
    }
    for (let i = 0; i < previousPlayers.Team2Players.length; i++) {
      if (previousPlayers.Team2Players[i] !== newPlayers.Team2Players[i]) {
        setPlayerDropdownList(players => players.filter(player => player.name !== name))
        const oldPlayerIndex = props.allPlayers.findIndex(player => player.name === previousPlayers.Team2Players[i].name)
        setPlayerDropdownList(players => [...players, { name: previousPlayers.Team2Players[i].name, newPlayer: props.allPlayers[oldPlayerIndex].newPlayer }])
        updateStarsDropdown(previousPlayers.Team2Players[i].name, name)
        setPreviousPlayers(newPlayers)
        return
      }
    }
  }
  
  const removeExistingPlayer = () => {
    const newPlayers = props.form.getFieldsValue()
    for (let i = 0; i < previousPlayers.Team1Players.length; i++) {
      if (previousPlayers.Team1Players[i] !== newPlayers.Team1Players[i]) {
        const oldPlayerIndex = props.allPlayers.findIndex(player => player.name === previousPlayers.Team1Players[i].name)
        setPlayerDropdownList(players => [...players, { name: previousPlayers.Team1Players[i].name, newPlayer: props.allPlayers[oldPlayerIndex].newPlayer }])
        props.setStarsDropdownList(players => players.filter(player => player.player_name !== previousPlayers.Team1Players[i].name))
        setPreviousPlayers(newPlayers)
        return
      }
    }
    for (let i = 0; i < previousPlayers.Team2Players.length; i++) {
      if (previousPlayers.Team2Players[i] !== newPlayers.Team2Players[i]) {
        const oldPlayerIndex = props.allPlayers.findIndex(player => player.name === previousPlayers.Team2Players[i].name)
        setPlayerDropdownList(players => [...players, { name: previousPlayers.Team2Players[i].name, newPlayer: props.allPlayers[oldPlayerIndex].newPlayer }])
        props.setStarsDropdownList(players => players.filter(player => player.player_name !== previousPlayers.Team2Players[i].name))
        setPreviousPlayers(newPlayers)
        return
      }
    }
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