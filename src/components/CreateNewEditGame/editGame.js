import { createNewGameStatFetch, editPlayerStatsFetch, deletePlayerStatsFetch } from '../Admin/PlayerFetchFunctions'
import { editGameFetch, createNewGameSummaryFetch, editGameSummaryFetch,  } from '../Admin/GameFetchFunctions'
import { editSeriesFetch } from '../Admin/SeriesFetchFunctions'
import { addNewPlayers } from '../Admin/CommonFunctions'

export const editGame = async (values, allPlayers, prevGameStats, team1Score, team2Score) => {
  let fetchErr = false

  const teamsInfo = [
    {
      team_score: team1Score,
      shootout_win: (values.ShootoutWinner === prevGameStats.game_result[0].team_name)
    },
    {
      team_score: team2Score,
      shootout_win: (values.ShootoutWinner === prevGameStats.game_result[1].team_name)
    }
  ]

  // function to add each player's stats into the gameStatsData dataset
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
    gameStatsData.game_result.push({ players: teamPlayers })
  }

  const editGameStats = async () => {
    addPlayerStats('Team1Players', 0)
    addPlayerStats('Team2Players', 1)
    // update the game_score and shootout_winner
    const game_data = {
      game_result: [...teamsInfo]
    }
    try {
      const res = await editGameFetch(game_data, prevGameStats.id)
      if (res.ok) {
        console.log('Success', await res.json())
      } else {
        throw new Error()
      }
    } catch (e) {
      fetchErr = true
    }
    // update all player stats and remove previous stats
    for (let i = 0; i < gameStatsData.game_result.length; i++) {
      const prevPlayers = prevGameStatsResults[i].players
      for (let j = 0; j < gameStatsData.game_result[i].players.length; j++) {
        const playerData = gameStatsData.game_result[i].players[j]
        const playerIndex = prevPlayers.findIndex(player => player.player_name === playerData.player_name)
        const prevPlayerData = prevPlayers[playerIndex]
        // if player was just added, create a new gamestat for the player
        if (!prevPlayerData) {
          const newPlayerStatsData = {
            game_id: prevGameStats.id,
            series_id: prevGameStats.series_id,
            game_result_id: prevGameStats.game_result[i].id,
            team_name: prevGameStats.game_result[i].team_name,
            ...playerData
          }
          try {
            const res = await createNewGameStatFetch(newPlayerStatsData)
            if (res.ok) {
              console.log('Success', await res.json())
            } else {
              throw new Error()
            }
          } catch (e) {
            fetchErr = true
          }
        } else {
          const statsChange = (prevPlayerData.goals !== playerData.goals || prevPlayerData.assists !== playerData.assists ||
            prevPlayerData.is_goalie !== playerData.is_goalie || prevPlayerData.win !== playerData.win || prevPlayerData.ga !== playerData.ga)
          // if stats or goalie stats have changed make a patch request to the gamestat
          if (statsChange) {
            try {
              const res = await editPlayerStatsFetch(playerData, prevPlayerData.id)
              if (res.ok) {
                console.log('Success', await res.json())
              } else {
                throw new Error()
              }
            } catch (e) {
              fetchErr = true
            }
          }
          // Remove player from prevGameStatsResults
          prevPlayers.splice(playerIndex, 1)
        }
      }
      // remove all players stats who weren't included in the update
      for (let j = 0; j < prevPlayers.length; j++) {
        const oldPlayer = prevPlayers[j]
        try {
          const res = await deletePlayerStatsFetch(oldPlayer.id)
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
    // edit game summary
    if (!values.game_summary.hidden) {
      const data = {
        game: prevGameStats.id,
        title: values.game_summary.title,
        summary: values.game_summary.summary,
        first_star: values.game_summary.star[0].name,
        second_star: values.game_summary.star[1].name,
        third_star: values.game_summary.star[2].name
      }
      //if there is an existing game summary, make a patch request
      if (prevGameStats.game_summary) {
        try {
          const res = await editGameSummaryFetch(data, prevGameStats.id)
          if (res.ok) {
            console.log('Success', await res.json())
          } else {
            throw new Error()
          }
        } catch (e) {
          fetchErr = true
        }
      }
      // else make a post to game summary
      else {
        try {
          const res = await createNewGameSummaryFetch(data, prevGameStats.id)
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

  // edit series instance to update series score
  const updateSeriesScore = async () => {
    const series_info = await (await fetch(`http://127.0.0.1:8000/series/${prevGameStats.series_id}/?only_series_score=true`)).json()
    const prevTeamWin = (prevGameStats.game_result[0].team_score > prevGameStats.game_result[1].team_score ||
      prevGameStats.game_result[0].shootout_win) ? 0 : 1
    const teamWin = (team1Score > team2Score || values.ShootoutWinner === prevGameStats.game_result[0].team_name) ? 0 : 1
    // if the previous team winner is not the same as the current team winner
    if (prevTeamWin !== teamWin) {
      // remove the win from the previous team winner and add a win to the current team winner
      const data = {
        teams: [
          {
            series_score: prevTeamWin === 0 ? series_info.teams[0].series_score - 1 : series_info.teams[0].series_score + 1
          },
          {
            series_score: prevTeamWin === 1 ? series_info.teams[1].series_score - 1 : series_info.teams[1].series_score + 1
          }
        ]
      }
      try {
        const res = await editSeriesFetch(data, prevGameStats.series_id)
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

  // create a game instance
  const gameStatsData = {
    game_result: []
  }
  // create copy of prevGameStats to bulk remove players after
  const prevGameStatsResults = [...prevGameStats.game_result]
  fetchErr = await addNewPlayers(allPlayers, values.Team1Players, values.Team2Players)
  await editGameStats()
  await updateSeriesScore()

  return !fetchErr
};