import React, { useState, useEffect } from 'react'
import { Form, Alert, Button } from 'antd';
import { SeriesAdminView } from '../Admin/SeriesAdminView'
import { Redirect } from 'react-router';

//functions
import { createNewSeries } from './createNewSeries'
import { editSeries } from './editSeries'

export const SeriesInstance = (props) => {
  const [ redirect, setRedirect ] = useState(false)
  const [ isLoading, setLoading ] = useState(true)

  // list of player names and Id
  const [ allPlayers, setAllPlayers ] = useState([])
  // list of all player names for validation
  const [ playerList, setPlayerList ] = useState([])
  const [ playerListId, setPlayerListId ] = useState(0)
  const [ teamList, setTeamList ] = useState([])
  const [ unsuccessfulSubmission, setUnsuccessfulSubmission ] = useState(false)
  const [ serverErrorMessage, setServerErrorMessage ] = useState(false)

  //edit states
  //existing players which were submitted previously 
  const [ team1Players, setTeam1Players ] = useState([])
  const [ team2Players, setTeam2Players ] = useState([])
  let team1 = {}
  let team2 = {}
  if (props.edit) {
    team1 = props.allSeries[props.allSeries.length - props.seriesId].teams[0]
    team2 = props.allSeries[props.allSeries.length - props.seriesId].teams[1]  
  }
  
  // obtain list of all player names from server & store in state
  useEffect(() => {
    // used for select options and ensuring name exist in system
    const getAllPlayers = async () => {
      const playersRes = await fetch `http://127.0.0.1:8000/players/?player_only=true`
      const players = await playersRes.json()
      const playerNames = []
      const playerNameList = []
      // create options out of list of names
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
      let filteredTeams = teams
      // filter teams to remove the editing teams name from the list of unacceptable names
      if (props.edit) {
        filteredTeams = filteredTeams.filter(team => team.series_id !== props.seriesId)
      }
      const teamNames = filteredTeams.map(team => {
        return team.name
      })
      setTeamList(teamNames)
    }

    // edit function: get all players for the team and insert captain into first spot
    const fetchPlayerData = async (teamInstance) => {
      const playerDataRes = await fetch (`http://127.0.0.1:8000/players/?team_id=${teamInstance.id}`)
      const playerData = await playerDataRes.json()
      // find index of the captain in the data
      const captainIndex = playerData.findIndex(player => player.name === teamInstance.captain)
      // make captain the first instance in the dataset
      playerData.splice(0, 0, playerData.splice(captainIndex, 1)[0])

      return playerData
    }

    getAllPlayers()
    getAllTeams()

    if (props.edit) {
      fetchPlayerData(team1).then(playerData => {
        setTeam1Players(playerData)
      })
      fetchPlayerData(team2).then(playerData => {
        setTeam2Players(playerData)
      }) 
    }
    setLoading(false)

  }, [])

  const onFinish = async values => {
    let success = false 
    if (props.edit) {
      success = await editSeries(values, allPlayers, team1, team2, team1Players, team2Players, props.seriesId)
      if (success) {
        props.setSeriesSuccess('Successfully edited series')
      }
    } else {
      success = await createNewSeries(values, allPlayers)
      if (success) {
        props.setSeriesSuccess('Successfully created a new series')
      }
    }
   
    if (success) {
      setRedirect(true)
      props.setSuccessfulSubmission(true)
    } else {
      setServerErrorMessage(true)
    }
  };

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
  
  //TODO: update initialValues to match number of players per series
  if (!isLoading && (!props.edit || (team1Players.length > 0 && team2Players.length > 0))) {
    let initialValues = {}
    if (props.edit) {
      const team1PlayersInfo = team1Players.map(player => {return {name: player.name}})
      const team2PlayersInfo = team2Players.map(player => {return {name: player.name}})
      initialValues = {
        'Team1Name': team1.name,
        'Team2Name': team2.name,
        'Team1Players': team1PlayersInfo,
        'Team2Players': team2PlayersInfo
      }
    } else {
      initialValues = {
        'Team1Players': [undefined, undefined, undefined],
        'Team2Players': [undefined, undefined, undefined]
      }
    }
    
    return (
      <>
        {redirect && <Redirect push to = '/teams' />}
        <Form 
          name="create_new_series" 
          {...formItemLayoutWithOutLabel} 
          onFinish={onFinish} 
          onFinishFailed={onFinishFailed}
          initialValues={initialValues}
        >
          <SeriesAdminView 
            playerListId={playerListId}
            setPlayerListId={setPlayerListId}
            setAllPlayers={setAllPlayers}
            setPlayerList={setPlayerList}
            allPlayers={allPlayers}
            teamList={teamList}
            playerList={playerList}
          />
          <Form.Item style={{textAlign: 'right'}}>
            <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
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