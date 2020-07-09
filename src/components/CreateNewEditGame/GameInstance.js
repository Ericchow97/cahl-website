import React, { useState, useEffect, useContext } from 'react'
import { Form, Alert, Button, message } from 'antd';
import { SeriesAdminView } from '../Admin/SeriesAdminView'
import { Redirect } from 'react-router';
import { CardTemplate } from '../CardTemplate'
import { SeriesCard } from '../SeriesCard'
import { ShootoutForm } from './ShootoutForm'
import { CreateGameSummary } from './CreateGameSummary'
import { AdminContext } from '../../AdminContextProvider'

//functions
import { createNewGame } from './createNewGame'
import { editGame } from './editGame'

export const GameInstance = (props) => {
  const adminContext = useContext(AdminContext)

  const [redirect, setRedirect] = useState(false)
  const [isLoading, setLoading] = useState(true)

  const [unsuccessfulSubmission, setUnsuccessfulSubmission] = useState(false)

  //CREATE variables
  const gameNum = !props.gameId && props.currentSeries.games.length ? props.currentSeries.games.length + 1 : 1
  const [team1Players, setTeam1Players] = useState([])
  const [team2Players, setTeam2Players] = useState([])

  // EDIT variables
  const [prevGameStats, setPrevGameStats] = useState({})

  // list of player names and Id for select options
  const [allPlayers, setAllPlayers] = useState(props.allPlayers)

  // for scoreboard display
  const [team1Score, setTeam1Score] = useState(0)
  const [team2Score, setTeam2Score] = useState(0)

  //for Shootout display
  const [showShootout, setShowShootout] = useState(true)

  // Error checking
  const [invalidGame, setInvalidGame] = useState(false)
  const [team1Goalies, setTeam1Goalies] = useState(0)
  const [team2Goalies, setTeam2Goalies] = useState(0)

  // Game summary display
  const [hideGameSummary, setGameSummaryHidden] = useState(false)

  // Access variables
  const team1Name = prevGameStats.game_result ? prevGameStats.game_result[0].team_name : props.currentSeries.teams[0].name
  const team2Name = prevGameStats.game_result ? prevGameStats.game_result[1].team_name : props.currentSeries.teams[1].name
  const [form] = Form.useForm()
  const [starsDropdownList, setStarsDropdownList] = useState([])


  // obtain list of all player names from server & store in state
  useEffect(() => {
    //EDIT function: to get all stats of the previous game submitted
    const fetchPrevGameData = async () => {
      let currentGame = props.allGames[props.allGames[0].id - props.gameId]
      if (currentGame) {
      } else {
        const editGameRes = await fetch(`http://127.0.0.1:8000/game/${props.gameId}/`)
        if (editGameRes.ok) {
          currentGame = await editGameRes.json()
        } else {
          setInvalidGame(true)
          setLoading(false)
          return
        }
      }
      setPrevGameStats(currentGame)
      setStarsDropdownList([...currentGame.game_result[0].players, ...currentGame.game_result[1].players])
      setShowShootout(currentGame.game_result[0].team_score === currentGame.game_result[1].team_score)
      setTeam1Score(currentGame.game_result[0].team_score)
      setTeam2Score(currentGame.game_result[1].team_score)
      setLoading(false)
    }

    if (props.gameId) {
      fetchPrevGameData()
      setTeam1Goalies(1)
      setTeam2Goalies(1)
    } else {
      setTeam1Players(props.currentSeries.teams[0].players)
      setTeam2Players(props.currentSeries.teams[1].players)
      setStarsDropdownList([...props.currentSeries.teams[0].players.map(player => {return {player_name: player.name}}), ...props.currentSeries.teams[1].players.map(player => {return {player_name: player.name}})])
      setLoading(false)
    }
  }, [props.currentSeries, props.allGames, props.gameId])

  const onFinish = async values => {
    let ret = false
    if (props.gameId) {
      ret = await editGame(values, allPlayers, prevGameStats, team1Score, team2Score, adminContext)
      if (ret.success) {
        message.success('Successfully edited game')
      }
    } else {
      ret = await createNewGame(values, allPlayers, props.currentSeries, team1Score, team2Score, adminContext)
      if (ret.success) {
        message.success('Successfully created game')
      }
    }

    if (ret.success) {
      setRedirect(true)
      props.setSuccessfulSubmission(count => count + 1)
    } else {
      message.error(ret.message)
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

  // get field values to calculate total score for each team
  const handleChange = (changedValue, allValues) => {
    if (changedValue.Team1Players || changedValue.Team2Players) {
      let team1Total = team1Score
      let team2Total = team2Score
      let numGoalies = 0
      if (changedValue.Team1Players) {
        let goals = 0
        for (let i = 0; i < allValues.Team1Players.length; i++) {
          if (Number.isInteger(allValues.Team1Players[i].goals)) {
            goals += allValues.Team1Players[i].goals
          }
          numGoalies += allValues.Team1Players[i].isGoalie ? 1 : 0
        }
        team1Total = goals
        setTeam1Goalies(numGoalies)
      } else if (changedValue.Team2Players) {
        let goals = 0
        for (let i = 0; i < allValues.Team2Players.length; i++) {
          if (Number.isInteger(allValues.Team2Players[i].goals)) {
            goals += allValues.Team2Players[i].goals
          }
          numGoalies += allValues.Team2Players[i].isGoalie ? 1 : 0
        }
        team2Total = goals
        setTeam2Goalies(numGoalies)
      }

      // show shootout if tied
      if (team1Total === team2Total) {
        setShowShootout(true)
      } else {
        setShowShootout(false)
      }

      // add shootout winner to score only if scores are tied
      if (team1Total === team2Total) {
        const team1Win = allValues.ShootoutWinner === team1Name ? 1 : 0
        const team2Win = allValues.ShootoutWinner === team2Name ? 1 : 0
        setTeam1Score(team1Total + team1Win)
        setTeam2Score(team2Total + team2Win)
      } else {
        setTeam1Score(team1Total)
        setTeam2Score(team2Total)
      }
    } else if (changedValue.game_summary) {
      setGameSummaryHidden(changedValue.game_summary.hidden)
    }
  }

  // pre-populate Initial Values in fields
  const getInitialValues = () => {
    let initialValue = {}
    let team1PlayersInfo, team2PlayersInfo, game_summary
    if (props.gameId) {
      team1PlayersInfo = prevGameStats.game_result[0].players.map(player => { return { name: player.player_name, goals: player.goals, assists: player.assists, isGoalie: player.is_goalie } })
      team2PlayersInfo = prevGameStats.game_result[1].players.map(player => { return { name: player.player_name, goals: player.goals, assists: player.assists, isGoalie: player.is_goalie } })
      // assign shootout winner
      if (prevGameStats.game_result[0].shootout_win) {
        initialValue.ShootoutWinner = team1Name
      } else if (prevGameStats.game_result[1].shootout_win) {
        initialValue.ShootoutWinner = team2Name
      }
      // assign game summary information if exists
      if (prevGameStats.game_summary.title) {
        game_summary = {
          title: prevGameStats.game_summary.title,
          summary: prevGameStats.game_summary.summary,
          star: [
            { name: prevGameStats.game_summary.first_star.name },
            { name: prevGameStats.game_summary.second_star.name },
            { name: prevGameStats.game_summary.third_star.name }
          ]
        }
      } else {
        game_summary = { star: [{ name: null }, { name: null }, { name: null }] }
      }
    } else {
      team1PlayersInfo = team1Players.map(player => { return { name: player.name, goals: 0, assists: 0, isGoalie: 0 } })
      team2PlayersInfo = team2Players.map(player => { return { name: player.name, goals: 0, assists: 0, isGoalie: 0 } })
      game_summary = { star: [{ name: null }, { name: null }, { name: null }] }
    }
    initialValue = {
      'Team1Players': team1PlayersInfo,
      'Team2Players': team2PlayersInfo,
      'game_summary': game_summary
    }
    return initialValue
  }

  if (!isLoading) {
    if (!invalidGame) {
      const initialValues = getInitialValues()
      return (
        <>
          {redirect && <Redirect push to={`/gameRecap`} />}
          <CardTemplate header={`Game ${props.gameId ? prevGameStats.num : gameNum}`} style={{ textAlign: "center" }} headerAlign={true}>
            <SeriesCard
              team1Name={team1Name}
              team2Name={team2Name}
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
            initialValues={initialValues}
            onValuesChange={(changedValue, allValues) => handleChange(changedValue, allValues)}
            form={form}
          >
            <SeriesAdminView
              form={form}
              setStarsDropdownList={setStarsDropdownList}
              gameStatsView={true}
              allPlayers={allPlayers}
              setAllPlayers={setAllPlayers}
              team1Name={team1Name}
              team2Name={team2Name}
              team1Goalies={team1Goalies}
              team2Goalies={team2Goalies}
            />
            {showShootout &&
              <ShootoutForm
                team1Name={team1Name}
                team2Name={team2Name}
                team1Score={team1Score}
                team2Score={team2Score}
              />
            }
            <CreateGameSummary
              starsDropdownList={starsDropdownList}
              hideGameSummary={hideGameSummary}
            />
            <Form.Item style={{ textAlign: 'right' }}>
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
        </>
      );
    } else {
      return <h1> Invalid Game </h1>
    }
  }
  else {
    return <h1>Loading</h1>
  }
}