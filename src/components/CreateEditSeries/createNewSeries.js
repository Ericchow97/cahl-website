import { createNewSeriesFetch } from '../Admin/SeriesFetchFunctions'
import { addNewPlayers } from '../Admin/CommonFunctions'
import { editPlayerFetch } from '../Admin/PlayerFetchFunctions'

export const createNewSeries = async (values, allPlayers) => {
  let fetchErr = false

  // creates a new series with new team and captain
  const createNewTeams = async () => {
    const newSeriesData = {
      teams: [
        {
          name: values.Team1Name,
          captain: values.Team1Players[0].name,
          players: values.Team1Players.map(player => player.name)
        },
        {
          name: values.Team2Name,
          captain: values.Team2Players[0].name,
          players: values.Team2Players.map(player => player.name)
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
  }

  const updatePlayerSet = async (teamPlayers, teamName) => {
    // sort through all the players from each team
    for (let i = 0; i < teamPlayers.length; i++) {
      const playerIndex = allPlayers.findIndex(player => player.name === teamPlayers[i].name)
      const playerInfo = allPlayers[playerIndex]
      // update existing player
      const data = {
        current_team: teamName,
        is_active: true,
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
      if (fetchErr) {
        break
      }
    }
  }

  await addNewPlayers(allPlayers, values.Team1Players, values.Team2Players)
  await createNewTeams()
  // make a patch request to set players from active to inactive
  allPlayers.forEach(async player => {
    if (player.is_active) {
      const data = {
        is_active: false,
        current_team: null
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
  await updatePlayerSet(values.Team1Players, values.Team1Name)
  await updatePlayerSet(values.Team2Players, values.Team2Name)
  return !fetchErr
};