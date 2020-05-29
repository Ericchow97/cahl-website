import React, { useState, useEffect } from 'react'
import { Form, Alert, Button } from 'antd';
import { SeriesAdminView } from '../Admin/SeriesAdminView'
import { Redirect } from 'react-router';

export const EditSeries = (props) => {
  const [ redirect, setRedirect ] = useState(false)
  const [ isLoading, setLoading ] = useState(true)

  // list of player names and Id
  const [ allPlayers, setAllPlayers ] = useState([])
  // list of all player names
  const [ playerList, setPlayerList ] = useState([])
  const [ playerListId, setPlayerListId ] = useState(0)
  const [ teamList, setTeamList ] = useState([])
  const [ team1Players, setTeam1Players ] = useState([])
  const [ team2Players, setTeam2Players ] = useState([])
  const [ successfulSubmission, setSuccessfulSubmission ] = useState(false)
  const [ unsuccessfulSubmission, setUnsuccessfulSubmission ] = useState(false)
  const [ serverErrorMessage, setServerErrorMessage ] = useState(false)

  const team1 = props.allSeries[props.allSeries.length - props.seriesId].teams[0]
  const team2 = props.allSeries[props.allSeries.length - props.seriesId].teams[1]
  // obtain list of all player names from server & store in state
  useEffect(() => {
    // used for select options and ensuring name exist in system
    const getAllPlayers = async () => {
      const playersRes = await fetch `http://127.0.0.1:8000/players/?player_only=true`
      const players = await playersRes.json()
      const playerNames = []
      const playerNameList = []
      players.forEach(player=> {
        playerNames.push({id: player.id, name: player.name, is_active: player.is_active, prev_teams: player.all_teams})
        playerNameList.push(player.name)
      })
      setPlayerListId(playerNames.reduce((a,b) => a.id > b.id ? a : b).id + 1)
      setAllPlayers(playerNames)
      setPlayerList(playerNameList)
    }

    // used to check if team name exist in the system already, if it does, throw an error
    const getAllTeams = async () => {
      const teamRes = await fetch `http://127.0.0.1:8000/teams/`
      const teams = await teamRes.json()
      const filterTeams = teams.filter(team => team.series_id !== props.seriesId)
      const teamNames = filterTeams.map(team => team.name)
      setTeamList(teamNames)
    }

    const fetchPlayerData = async (teamInstance) => {
      const playerDataRes = await fetch (`http://127.0.0.1:8000/players/?team_id=${teamInstance.id}`)
      const playerData = await playerDataRes.json()
      const captainIndex = playerData.findIndex(player => player.name === teamInstance.captain)
      playerData.splice(0, 0, playerData.splice(captainIndex, 1)[0])

      return playerData
    }

    getAllPlayers()
    getAllTeams()   
    fetchPlayerData(team1).then(playerData => {
      setTeam1Players(playerData)
    })
    fetchPlayerData(team2).then(playerData => {
      setTeam2Players(playerData)
    }) 
    setLoading(false)

  }, [])

  const onFinish = async values => {
    const changeTeamName = (team1.name !== values.Team1Name || 
      team2.name !== values.Team2Name ||
      team1.captain !== values.Team1Players[0] ||
      team2.captain !== values.Team2Players[0] 
      ) 
    setServerErrorMessage(false)
    let fetchErr = false
    if (changeTeamName) {
      // make patch request to series for team name and captain
      const newSeriesData = {
        teams: [
          {
            name: values.Team1Name,
            captain: values.Team1Players[0].name
          },
          {
            name: values.Team2Name,
            captain: values.Team2Players[0].name
          }
        ]
      }
      await fetch(`http://127.0.0.1:8000/series/${props.seriesId}/`, {
        method: 'PATCH',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSeriesData)
      })
      .then(async (response) => await response.json())
      .catch((error) => {
        console.error('Error:', error);
        fetchErr = true
        setServerErrorMessage(true)
      })
    }

    if (fetchErr) {
      return
    }

    // compare the submission of the new team to the existing team
    // New team = values
    // Existing team = team1Players && team2Players
    const updatePlayerSet = async (newTeamPlayers, oldTeamPlayers, teamName) => {
      // sort through all the players from each team
      for (let i = 0; i < newTeamPlayers.length; i++) {
        const playerIndex = allPlayers.findIndex(player => player.name === newTeamPlayers[i].name)
        const playerInfo = allPlayers[playerIndex]
        // if player is a new player, make a post request to create a new player
        if (playerInfo.newPlayer) {
          const data = {
            name: playerInfo.name,
            current_team: teamName,
            all_teams: [teamName]
          }
          await fetch(`http://127.0.0.1:8000/players/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then((response) => response.json())
          .then((data) => {
            console.log('Success:', data);
          })
          .catch((error) => {
            console.error('Error:', error);
            fetchErr = true
            setServerErrorMessage(true)
          })
        } else {
          const team1NameIndex = playerInfo.prev_teams.findIndex(team => team === team1.name)
          const team2NameIndex = playerInfo.prev_teams.findIndex(team => team === team2.name)
          // player was on team 1, but new team name is not the same as team 1
          const team1ToTeam2 = (playerInfo.prev_teams[team1NameIndex] !== undefined && playerInfo.prev_teams[team1NameIndex] !== teamName)
          // player was on team 2, but new team name is not the same as team 2
          const team2ToTeam1 = (playerInfo.prev_teams[team2NameIndex] !== undefined && playerInfo.prev_teams[team2NameIndex] !== teamName)
          // player was on neither team 1 nor team 2
          const isNewAddition = (playerInfo.prev_teams[team1NameIndex] === undefined && playerInfo.prev_teams[team2NameIndex] === undefined)
          //TODO: Test isNewAddition
          // if team name has changed OR player has changed teams OR is a new existing player create a patch request to the player
          if (changeTeamName || team1ToTeam2 || team2ToTeam1 || isNewAddition) {
            // replace the old name with the new name
            if (!isNewAddition) {
              const replaceIndex = team1NameIndex > 1 ? team1NameIndex : team2NameIndex 
              playerInfo.prev_teams.splice(replaceIndex, 1, teamName)
            } else {
              playerInfo.prev_teams.push(teamName)
            }
            const data = {
              current_team: teamName,
              is_active: true,
              all_teams: playerInfo.prev_teams
            }
            await fetch(`http://127.0.0.1:8000/players/${playerInfo.id}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((data) => {
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Error:', error);
              fetchErr = true
              setServerErrorMessage(true)
            })
          }
        }
        if (fetchErr) {
          break
        }
      }
      for (let i = 0; i < oldTeamPlayers.length; i++) {
        // loop through new list of players, if old player is not in new list then
        const oldPlayerExist = newTeamPlayers.some(newPlayerName => newPlayerName.name === oldTeamPlayers[i].name)
        if (!oldPlayerExist) {
          // delete if previous team length === 1
          if (oldTeamPlayers[i].all_teams === 1) {
            await fetch(`http://127.0.0.1:8000/players/${oldTeamPlayers[i].id}/`, {
              method: 'DELETE'
            })
            .then((response) => response.json())
            .then((data) => {
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Error:', error);
              fetchErr = true
              setServerErrorMessage(true)
            })
          }
          // patch request if its previous team length is greater than 1
          else {
            const team1NameIndex = oldTeamPlayers[i].all_teams.findIndex(team => team === team1.name)
            const team2NameIndex = oldTeamPlayers[i].all_teams.findIndex(team => team === team2.name)
            if (team1NameIndex > 0) {
              oldTeamPlayers[i].all_teams.splice(team1NameIndex, 1)
            } else if (team1NameIndex > 0) {
              oldTeamPlayers[i].all_teams.splice(team2NameIndex, 1)
            }
            const data = {
              current_team: null,
              is_active: false,
              all_teams: oldTeamPlayers[i].all_teams
            }
            await fetch(`http://127.0.0.1:8000/players/${oldTeamPlayers[i].id}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((data) => {
              console.log('Success:', data);
            })
            .catch((error) => {
              console.error('Error:', error);
              fetchErr = true
              setServerErrorMessage(true)
            })

          }

        }
      }
    }
    updatePlayerSet(values.Team1Players, team1Players, values.Team1Name)
    updatePlayerSet(values.Team2Players, team2Players, values.Team2Name)
    if (!fetchErr) {
      setUnsuccessfulSubmission(false)
      setSuccessfulSubmission(true)
      setRedirect(true)
      props.setSuccessfulSubmission(true)
    } else {
      return
    }
  };

  // should do something when user fails?
  const onFinishFailed = () => {
    setUnsuccessfulSubmission(true)
  }
  
  const handleClose = () => {
    setUnsuccessfulSubmission(false)
  }

  
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };
  
  //TODO: update baseFields to match number of players per series
  if (!isLoading && team1Players.length > 0 && team2Players.length > 0) {
    const team1PlayersInfo = team1Players.map(player => {return {name: player.name}})
    const team2PlayersInfo = team2Players.map(player => {return {name: player.name}})
    const initialValue = {
      'Team1Name': team1.name,
      'Team2Name': team2.name,
      'Team1Players': team1PlayersInfo,
      'Team2Players': team2PlayersInfo
    }
    return (
      <>
        {redirect && <Redirect push to = {`/teams/${props.seriesId}`} />}
        <Form 
          name="edit_series" 
          {...formItemLayoutWithOutLabel} 
          onFinish={onFinish} 
          onFinishFailed={onFinishFailed}
          initialValues={initialValue}
        >
          <SeriesAdminView 
            allPlayers={allPlayers}
            setAllPlayers={setAllPlayers}
            playerList={playerList}
            setPlayerList={setPlayerList}
            teamList={teamList}
            team1Players={team1Players}
            team2Players={team2Players}
            playerListId={playerListId}
            setPlayerListId={setPlayerListId}
            allowDefault={true}
          />
          <Form.Item style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        {successfulSubmission && 
          <Alert 
            message="Successfully edited series" 
            type="success"
            closable
            showIcon
          />
        }
        {unsuccessfulSubmission && 
          <Alert 
            message="Please complete the required fields" 
            type="error"
            closable
            showIcon
            afterClose={() => handleClose('fail')}
          />
        }
        {serverErrorMessage && 
          <Alert 
            message="Server Error" 
            type="error"
            closable
            showIcon
          />
        }
      </>
    );
  } else {
    return <h1>Loading</h1>
  }
  

}