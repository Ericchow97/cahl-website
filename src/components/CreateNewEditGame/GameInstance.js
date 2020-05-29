import React, { useState, useEffect } from 'react'
import { Form, Alert, Button} from 'antd';
import { SeriesAdminView } from '../Admin/SeriesAdminView'
import { Redirect } from 'react-router';
import { CardTemplate } from '../CardTemplate'
import { SeriesCard } from '../SeriesCard'
import { ShootoutForm } from './ShootoutForm'
import { CreateGameSummary } from './CreateGameSummary'

//functions
import { createNewGame } from './createNewGame'
import { editGame } from './editGame'
import { useParams } from 'react-router-dom'

export const GameInstance = (props) => {
  const [redirect, setRedirect] = useState(false)
  // required for fetch functions
  const [isLoading, setLoading] = useState(true)

  // list of player names and Id for select options
  const [allPlayers, setAllPlayers] = useState([])
  // list of all player names for enum to evaluate existing names
  const [playerList, setPlayerList] = useState([])
  // give new players an id on create
  const [playerListId, setPlayerListId] = useState(0)
  // keep track of the teams players selected and previous stats
  const [team1Players, setTeam1Players] = useState([])
  const [team2Players, setTeam2Players] = useState([])

  const [ serverErrorMessage, setServerErrorMessage ] = useState(false)
  const [ unsuccessfulSubmission, setUnsuccessfulSubmission ] = useState(false)
  
  // for scoreboard display
  const [ team1Score, setTeam1Score ] = useState(0)
  const [ team2Score, setTeam2Score ] = useState(0)

  //for Shootout display
  const [ showShootout, setShowShootout ] = useState(true)

  //edit variables
  const { gameId } = useParams()
  const [ prevGameStats, setPrevGameStats ] = useState({})
  const [ starsList, setStarsList ] = useState([])
  const [ editCondition, setEditCondition ] = useState(false)
  const [ noGameSummary, setNoGameSummary ] = useState(false)

  // create access variables
  const team1 = props.allSeries[0].teams[0]
  const team2 = props.allSeries[0].teams[1]
  const gameNum = props.allSeries[0].games.length ? props.allSeries[0].games.length + 1 : 1
  const [ formRef ] = Form.useForm()

  // obtain list of all player names from server & store in state
  useEffect(() => {
    // used for select options and ensuring name exist in system
    const getAllPlayers = async () => {
      const playersRes = await fetch`http://127.0.0.1:8000/players/?player_only=true`
      const players = await playersRes.json()
      const playerNames = []
      const playerNameList = []
      // create options out of list of names
      players.forEach(player => {
        playerNames.push({ id: player.id, name: player.name, is_active: player.is_active, prev_teams: player.all_teams })
        playerNameList.push(player.name)
      })
      setPlayerListId(playerNames.reduce((a, b) => a.id > b.id ? a : b).id + 1)
      setAllPlayers(playerNames)
      setPlayerList(playerNameList)
    }
    
    // list of players on the team and stats for all games
    const fetchPlayerData = async (teamInstance) => {
      const playerDataRes = await fetch(`http://127.0.0.1:8000/players/?team_id=${teamInstance.id}`)
      const playerData = await playerDataRes.json()
      const captainIndex = playerData.findIndex(player => player.name === teamInstance.captain)
      playerData.splice(0, 0, playerData.splice(captainIndex, 1)[0])
      return playerData
    }

    //EDIT function: to get all stats of the previous game submitted
    const fetchPrevGameData = async () => {
      const prevGameDataRes = await fetch(`http://127.0.0.1:8000/game/${gameId}/`)
      const prevGameData = await prevGameDataRes.json()
      setPrevGameStats(prevGameData)
      setTeam1Score(prevGameData.game_result[0].team_score)
      setTeam2Score(prevGameData.game_result[1].team_score)
      if (prevGameData.game_summary) {
        const firstStarRes = await fetch(prevGameData.game_summary.first_star)
        const firstStarData = await firstStarRes.json()
        setStarsList(firstStarData.name)
        const secondStarRes = await fetch(prevGameData.game_summary.second_star)
        const secondStarData = await secondStarRes.json()
        setStarsList(starsList => [starsList, secondStarData.name])
        const thirdStarRes = await fetch(prevGameData.game_summary.third_star)
        const thirdStarData = await thirdStarRes.json()
        setStarsList(starsList => [...starsList, thirdStarData.name])
      } else {
        setNoGameSummary(true)
      }
    }

    getAllPlayers()
    fetchPlayerData(team1).then(playerData => {
      setTeam1Players(playerData)
    })
    fetchPlayerData(team2).then(playerData => {
      setTeam2Players(playerData)
    })

    if (props.edit) {
      fetchPrevGameData()
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    if (props.edit) {
      if (starsList.length === 3 || noGameSummary) {
        setEditCondition(true)
      }
    } else {
      setEditCondition(true)
    }
  }, [starsList, noGameSummary])


  //TODO: SET UP A SHOOTOUT SECTION TO DETERMINE WINNER
  const onFinish = async values => {
    let success = false
    if (props.edit) {
      success = await editGame(values, allPlayers, props.allSeries, team1Score, team2Score, prevGameStats)
      if (success) {
        props.setGameSuccess('Successfully edited game')
      }
    } else {
      success = await createNewGame(values, allPlayers, props.allSeries, team1Score, team2Score)
      if (success) {
        props.setGameSuccess('Successfully created game')
      }
    }

    if (success) {
      setRedirect(true)
      props.setSuccessfulSubmission(true)
    } else {
      setServerErrorMessage(true)
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
   // get field values to calculate total score
   const handleChange = () => {
    const teams = ['Team1Players', 'Team2Players']
    const teamNames = [team1.name, team2.name]
    let teamScores = []
    const res = formRef.getFieldsValue(['Team1Players', 'Team2Players', 'ShootoutWinner'])
    for (let i = 0; i < teams.length; i ++) {
      let score = 0
      res[teams[i]].forEach(player => {
        if (player.goals) {
          score += player.goals
        }
      })
      teamScores.push(score)
    }

    //set display logic for shootout
    if (teamScores[0] === teamScores[1] || res['ShootoutWinner']) {
      setShowShootout(true)
    } else {
      setShowShootout(false)
    }
    // add shootout winner to score only if scores are tied
    if (teamScores[0] === teamScores[1]) {
      if (res['ShootoutWinner'] === teamNames[0]) {
        setTeam1Score(teamScores[0] + 1)
        setTeam2Score(teamScores[1])
      } else if (res['ShootoutWinner'] === teamNames[1]) {
        setTeam1Score(teamScores[0])
        setTeam2Score(teamScores[1] + 1)
      }
    } else {
      setTeam1Score(teamScores[0])
      setTeam2Score(teamScores[1])
    }
  }

  if (!isLoading && team1Players.length > 0 && team2Players.length > 0 && editCondition) {
    let initialValue = {}
    if (props.edit && (starsList.length === 3 || noGameSummary)) {
      const team1PlayersInfo = prevGameStats.game_result[0].players.map(player => {return {name: player.player_name, goals: player.goals, assists: player.assists, isGoalie: player.is_goalie}})
      const team2PlayersInfo = prevGameStats.game_result[1].players.map(player => {return {name: player.player_name, goals: player.goals, assists: player.assists, isGoalie: player.is_goalie}})
      const shootout_winner = prevGameStats.game_result[0].shootout_win === true ? prevGameStats.game_result[0].team_name : prevGameStats.game_result[1].shootout_win === true ? prevGameStats.game_result[1].team_name : undefined
      initialValue = {
        'Team1Players': team1PlayersInfo,
        'Team2Players': team2PlayersInfo
      }
      if (shootout_winner) {
        initialValue.ShootoutWinner = shootout_winner
      }
      if (starsList.length === 3) {
        initialValue.game_summary = {
          title: prevGameStats.game_summary.title, 
          summary: prevGameStats.game_summary.summary, 
          star: [
            {name: starsList[0]}, 
            {name: starsList[1]}, 
            {name: starsList[2]}
          ]
        }
      } else {
        initialValue.game_summary = {star: [{name: null}, {name: null}, {name: null}]}
      }
    } else {
      const team1PlayersInfo = team1Players.map(player => {return {name: player.name}})
      const team2PlayersInfo = team2Players.map(player => {return {name: player.name}})
      initialValue = {
        'Team1Players': team1PlayersInfo,
        'Team2Players': team2PlayersInfo,
        'game_summary': {star: [{name: null}, {name: null}, {name: null}]}
      }
    }
    return (
      <>
        {redirect && <Redirect push to={`/gameRecap`} />}
        <CardTemplate header={`Game ${props.edit ? prevGameStats.num : gameNum}`} style={{textAlign:"center"}} headerAlign={true}>
          <SeriesCard 
            team1Name={props.edit ? prevGameStats.game_result[0].team_name : team1.name}
            team2Name={props.edit ? prevGameStats.game_result[1].team_name : team2.name}
            team1Score={team1Score}
            team2Score={team2Score}
            disableRedirect={true}
          />
        </CardTemplate>
        <Form
          name="edit_series"
          {...formItemLayoutWithOutLabel}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={initialValue}
          form={formRef}
        >
          <SeriesAdminView
            allPlayers={allPlayers}
            setAllPlayers={setAllPlayers}
            playerList={playerList}
            setPlayerList={setPlayerList}
            team1Players={team1Players}
            team2Players={team2Players}
            playerListId={playerListId}
            setPlayerListId={setPlayerListId}
            gameStatsView={true}
            team1Name={props.edit ? prevGameStats.game_result[0].team_name : team1.name}
            team2Name={props.edit ? prevGameStats.game_result[1].team_name : team2.name}
            formRef={formRef}
            handleChange={handleChange}
          />
          {showShootout && 
            <ShootoutForm 
              team1Name={props.edit ? prevGameStats.game_result[0].team_name : team1.name}
              team2Name={props.edit ? prevGameStats.game_result[1].team_name : team2.name}
              team1Score={team1Score}
              team2Score={team2Score}
              handleChange={handleChange}
            />
          }
          <CreateGameSummary
            allPlayers={allPlayers}
            playerList={playerList}
            formRef={formRef}
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