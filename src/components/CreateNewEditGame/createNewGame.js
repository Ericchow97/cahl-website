import { createNewGameFetch, createNewGameSummaryFetch } from '../Admin/GameFetchFunctions'
import { editSeriesFetch } from '../Admin/SeriesFetchFunctions'
import { addNewPlayers } from '../Admin/CommonFunctions'

export const createNewGame = async (values, allPlayers, currentSeries, team1Score, team2Score) => {
  let fetchErr = false

  const teamsInfo = [
    {
      team_name: currentSeries.teams[0].name,
      team_score: team1Score,
      shootout_win: (values.ShootoutWinner === currentSeries.teams[0].name)
    },
    {
      team_name: currentSeries.teams[1].name,
      team_score: team2Score,
      shootout_win: (values.ShootoutWinner === currentSeries.teams[1].name)
    }
  ]

  // function to add each player's stats into the newGameData dataset
  const addPlayerStats = (teamNumPlayers, teamInstance) => {
    const opposite_team = teamInstance === 0 ? 1 : 0
    const win = (teamsInfo[teamInstance].team_score > teamsInfo[opposite_team].team_score ||
      teamsInfo[teamInstance].shootout_win) ? 1 : 0

    // parse each players stats to json format 
    const teamPlayers = values[teamNumPlayers].map(player => {
      return {
        player_name: player.name,
        goals: player.goals ? player.goals : 0,
        assists: player.assists ? player.assists : 0,
        is_goalie: player.isGoalie ? 1 : 0,
        ga: player.isGoalie ? teamsInfo[opposite_team].team_score : 0,
        win: player.isGoalie ? win : 0
      }
    })
    newGameData.game_result.push({ ...teamsInfo[teamInstance], players: teamPlayers })
  }

  const createGame = async () => {
    addPlayerStats('Team1Players', 0)
    addPlayerStats('Team2Players', 1)
    try {
      // game_id used for creating game summary
      let game_id = await createNewGameFetch(newGameData)
      if (game_id.ok) {
        game_id = await game_id.json()
        console.log('Success', game_id)
      } else {
        throw new Error()
      }
      if (!values.game_summary.hidden) {
        const data = {
          game: game_id.id,
          title: values.game_summary.title,
          summary: values.game_summary.summary,
          first_star: values.game_summary.star[0].name,
          second_star: values.game_summary.star[1].name,
          third_star: values.game_summary.star[2].name
        }
        try {
          const res = await createNewGameSummaryFetch(data)
          if (res.ok) {
            console.log('Success', await res.json())
          } else {
            throw new Error()
          }
        } catch {
          fetchErr = true
        }
      }
    } catch {
      fetchErr = true
    }
  }

  // edit series instance to update series score
  const updateSeriesScore = async () => {
    const teamWin = (team1Score > team2Score || values.ShootoutWinner === currentSeries.teams[0].name) ? 0 : 1
    const data = {
      teams: [
        {
          series_score: teamWin === 0 ? currentSeries.teams[0].series_score + 1 : currentSeries.teams[0].series_score
        },
        {
          series_score: teamWin === 1 ? currentSeries.teams[1].series_score + 1 : currentSeries.teams[1].series_score
        }
      ]
    }
    try {
      const res = await editSeriesFetch(data, currentSeries.id)
      if (res.ok) {
        console.log('Success', await res.json())
      } else {
        throw new Error()
      }
    } catch (e) {
      fetchErr = true
    }
  }

  // create a new game instance on the server
  const newGameData = {
    series_id: currentSeries.id,
    num: currentSeries.games.length ? currentSeries.games.length + 1 : 1,
    game_result: []
  }

  fetchErr = await addNewPlayers(allPlayers, values.Team1Players, values.Team2Players)
  await createGame()
  await updateSeriesScore()

  return !fetchErr
};