import { createNewPlayerFetch, editPlayerStatsFetch, deletePlayerStatsFetch } from '../Admin/PlayerFetchFunctions'
import { editGameFetch, createNewGameSummaryFetch, editGameSummaryFetch, createNewGameStatFetch } from '../Admin/GameFetchFunctions'
import { editSeriesFetch } from '../Admin/SeriesFetchFunctions'

export const editGame = async (values, allPlayers, allSeries, team1Score, team2Score, prevGameStats) => {
  let fetchErr = false

  const teamsInfo = [
    {
      team_score: team1Score,
      shootout_win: (values.ShootoutWinner === allSeries[0].teams[0].name)
    },
    {
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
    const teamData = {players:[]}
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
      } else {
        playerData.win = false
      }
      teamData.players.push(playerData)
    })
    data.game_result.push(teamData)
  }

  const editGameStats = async () => {
    // create a game instance
    const data = {
      game_result: []
    }
    addPlayerStats('Team1Players', 0, data)
    addPlayerStats('Team2Players', 1, data)
    // update the game
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
    // update all added players 
    // loops through both teams
    for (let i = 0; i < data.game_result.length; i++) {
      // loops through all submitted players
      for (let j = 0; j < data.game_result[i].players.length; j++) {
        const newPlayer = data.game_result[i].players[j]
        const playerIndex = prevGameStats.game_result[i].players.findIndex(player => player.player_name === newPlayer.player_name)
        const prevPlayerData = prevGameStats.game_result[i].players[playerIndex]
        // if player was just added, create a new gamestat for the player
        if (!prevPlayerData) {
          const newPlayerStatsData = {
            game_id: prevGameStats.id,
            series_id: prevGameStats.series_id,
            team_name: prevGameStats.game_result[i].team_name,
            game_result_id: prevGameStats.game_result[i].id,
            ...newPlayer
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
          continue
        }
        const isStatsChanged = (prevPlayerData.goals !==newPlayer.goals || prevPlayerData.assists !==newPlayer.assists ||
          prevPlayerData.is_goalie !==newPlayer.is_goalie || prevPlayerData.ga !==newPlayer.ga)
        const goalieWinChange = ((prevPlayerData.is_goalie ||newPlayer.is_goalie) && prevPlayerData.win !==newPlayer.win)
        // if stats have changed or the goalie stats have changed make a patch request to the gamestat
        if (isStatsChanged || goalieWinChange) {
          try {
            const res = await editPlayerStatsFetch(newPlayer, prevPlayerData.id)
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
    // remove all old players stats
    // loop through both teams previous data
    for (let i = 0; i < prevGameStats.game_result.length; i++) {
      // loops through all submitted players
      for (let j = 0; j < prevGameStats.game_result[i].players.length; j++) {
        const oldPlayer = prevGameStats.game_result[i].players[j]
        const playerIndex = data.game_result[i].players.findIndex(player => player.player_name === oldPlayer.player_name)
        const prevPlayerData = data.game_result[i].players[playerIndex]
        // if player exist in the prev data stats, but not in the current data stats then remove the stat
        if (!prevPlayerData) {
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
    }
    // edit game summary
    if (!values.game_summary.display) {
      //if there is an exisitng game summary, make a patch request
      if (prevGameStats.game_summary) {
        try {
          const res = await editGameSummaryFetch(values, allPlayers, prevGameStats.id)
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
          const res = await createNewGameSummaryFetch(values, allPlayers, prevGameStats)
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
    const prevTeamWin = prevGameStats.game_result[0].team_score > prevGameStats.game_result[1].team_score ? 0 : 1 
    const teamWin = team1Score > team2Score ? 0 : 1
    // if the previous team winner is not the same as the current team winner
    if (prevTeamWin !== teamWin) {
      // remove the win from the previous team winner and add a win to the current team winner
      const data = {
        teams: [
          {
            series_score: prevTeamWin === 0 ? allSeries[0].teams[0].series_score - 1 : allSeries[0].teams[0].series_score + 1
          },
          {
            series_score: prevTeamWin === 1 ? allSeries[0].teams[1].series_score - 1 : allSeries[0].teams[1].series_score + 1
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
    
    
  }

  editGameStats()
  updateSeriesScore()

  return !fetchErr
};