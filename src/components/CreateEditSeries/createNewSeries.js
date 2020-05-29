import { createNewSeriesFetch } from '../Admin/SeriesFetchFunctions'
import { createNewPlayerFetch, editPlayerFetch } from '../Admin/PlayerFetchFunctions'

export const createNewSeries = async (values, allPlayers) => {
  let fetchErr = false
  // make request to create a new series with new team and captain
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
  try {
    const res = await createNewSeriesFetch(newSeriesData)
    if (res.ok) {
      console.log('Success', await res.json())
    } else {
      throw new Error()
    }
  } catch (e) {
    fetchErr = true
  }
  if (fetchErr) {
    return
  }

  // make a patch request to set all players from active to inactive
  allPlayers.forEach(async player => {
    // only make call to API if they were previously an active player and not in the new series
    if (player.is_active && !(values.Team1Players.some(activePlayer => activePlayer.name === player.name) || values.Team2Players.some(activePlayer => activePlayer.name === player.name))) {
      const data = {
        is_active: false
      }
      try {
        const res = await editPlayerFetch(data, player.id)
        if (res.ok) {
          console.log('Success', await res.json())
        } else {
          throw new Error()
        }
      } catch {
        fetchErr = true
      }
    }
  })
  const updatePlayerSet = async (teamPlayers, teamName) => {
    // sort through all the players from each team
    for (let i = 0; i < teamPlayers.length; i++) {
      const playerIndex = allPlayers.findIndex(player => player.name === teamPlayers[i].name)
      const playerInfo = allPlayers[playerIndex]
      // if player is a new player, make a post request to create a new player
      if (playerInfo.newPlayer) {
        const data = {
          name: playerInfo.name,
          current_team: teamName,
          all_teams: [teamName]
        }
        try {
          const res = await createNewPlayerFetch(data)
          if (res.ok) {
            console.log('Success', await res.json())
          } else {
            throw new Error()
          }
        } catch {
          fetchErr = true
        }
      }
      // else create a patch request to the player
      else {
        const data = {
          current_team: teamName,
          is_active: true,
          all_teams: [...playerInfo.prev_teams, teamName]
        }
        try {
          const res = await editPlayerFetch(data, playerInfo.id)
          if (res.ok) {
            console.log('Success', await res.json())
          } else {
            throw new Error()
          }
        } catch {
          fetchErr = true
        }
      }
      if (fetchErr) {
        break
      }
    }
  }
  updatePlayerSet(values.Team1Players, values.Team1Name)
  updatePlayerSet(values.Team2Players, values.Team2Name)
  return !fetchErr
};