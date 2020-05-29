import { createNewPlayerFetch } from '../Admin/PlayerFetchFunctions'
import { createNewGameFetch, createNewGameSummaryFetch } from '../Admin/GameFetchFunctions'
import { editSeriesFetch } from '../Admin/SeriesFetchFunctions'

export const createNewGame = async (values, allPlayers, allSeries, team1Score, team2Score) => {
  let fetchErr = false

  const teamsInfo = [
    {
      team_name: allSeries[0].teams[0].name,
      team_score: team1Score,
      shootout_win: (values.ShootoutWinner === allSeries[0].teams[0].name)
    },
    {
      team_name: allSeries[0].teams[1].name,
      team_score: team2Score,
      shootout_win: (values.ShootoutWinner === allSeries[0].teams[1].name)
    }
  ]
  // loop through all players on the current team, add player to the database if they are a new player 
  const addNewPlayers = async (teamPlayers) => {
    for (let i = 0; i < teamPlayers.length; i++) {
      // find the index of the player in the player list
      const playerIndex = allPlayers.findIndex(player => player.name === teamPlayers[i].name)
      const playerInfo = allPlayers[playerIndex]
      // if player is a new player, make a post request to create a new player
      if (playerInfo.newPlayer) {
        const data = {
          name: playerInfo.name,
        }
        try {
          const res = await createNewPlayerFetch(data)
          if (res.ok) {
            console.log('Success', await res.json())
          } else {
            throw new Error()
          }
        } catch (e) {
          fetchErr = true
        }
      }
    }
  }

  // function to add player stats to the dataset
  const addPlayerStats = (teamNumPlayers, teamInstance, data) => {
    const teamPlayers = values[teamNumPlayers]
    const teamData = {...teamsInfo[teamInstance], players:[]}
    const opposite_team = teamInstance === 0 ? 1 : 0
    //add new players before adding to the dataset
    addNewPlayers(teamPlayers)
    // add each player stats to the players section, then add the data to the dataset
    teamPlayers.forEach(player => {
      const playerData = {
        player_name: player.name,
        goals: player.goals ? player.goals : 0,
        assists: player.assists ? player.assists : 0,
        is_goalie: player.isGoalie ? true : false,
        ga: player.isGoalie ? teamsInfo[opposite_team].team_score : 0
      }
      // if they're a goalie add additional stats
      if (playerData.is_goalie) {
        if (teamsInfo[teamInstance].team_score > teamsInfo[opposite_team].team_score) {
          playerData.win = true
        } else {
          playerData.win = false
        }
      }
      teamData.players.push(playerData)
    })
    data.game_result.push(teamData)
  }

  const createGame = async () => {
    // create a new game instance on the server
    const data = {
      series_id: allSeries[0].id,
      num: allSeries[0].games.length ? allSeries[0].games.length + 1 : 1,
      game_result: []
    }
    addPlayerStats('Team1Players', 0, data)
    addPlayerStats('Team2Players', 1, data)
    try {
      // game_id used for creating game summary
      let game_id = await createNewGameFetch(data)
      if (game_id.ok) {
        game_id = await game_id.json()
        console.log('Success', game_id)
      } else {
        throw new Error()
      }
      if (!values.game_summary.display) {
        try {
          const res = await createNewGameSummaryFetch(values, allPlayers, game_id)
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
    const teamWin = team1Score > team2Score ? 0 : 1
    const data = {
      teams: [
        {
          series_score: teamWin === 0 ? allSeries[0].teams[0].series_score + 1 : allSeries[0].teams[0].series_score
        },
        {
          series_score: teamWin === 1 ? allSeries[0].teams[1].series_score + 1 : allSeries[0].teams[1].series_score
        }
      ]
    }
    try {
      const res = await editSeriesFetch(data, allSeries[0].id)
      if (res.ok) {
        console.log('Success', await res.json())
      } else {
        throw new Error()
      }
    } catch (e) {
      fetchErr = true
    }
  }

  createGame()
  updateSeriesScore()

  return !fetchErr
};