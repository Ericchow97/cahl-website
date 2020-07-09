import { createNewSeriesFetch } from '../Admin/SeriesFetchFunctions'
import { addNewPlayers } from '../Admin/CommonFunctions'
import { editPlayerFetch } from '../Admin/PlayerFetchFunctions'
import { fetchRequest } from '../Admin/CommonFunctions'

export const createNewSeries = async (values, allPlayers, context) => {

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
    const ret = await fetchRequest(createNewSeriesFetch, context, 'create', { data: newSeriesData })
    if (!ret.success) {
      return ret
    }
    return { success: true }
  }

  // make a patch request to set players from active to inactive
  const setPlayersInactive = async () => {
    allPlayers.forEach(async player => {
      if (player.is_active) {
        const data = {
          is_active: false,
          current_team: null
        }
        const ret = await fetchRequest(editPlayerFetch, context, 'update', { data: data, id: player.id })
        if (!ret.success) {
          return ret
        }
      }
    })
    return { success: true }
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
      const ret = await fetchRequest(editPlayerFetch, context, 'update', { data: data, id: playerInfo.id })
      if (!ret.success) {
        return ret
      }
    }
    return { success: true }
  }

  const addNewPlayersRes = await addNewPlayers(allPlayers, values.Team1Players, values.Team2Players, context)
  if (!addNewPlayersRes.success) {
    return addNewPlayersRes
  }
  const createNewTeamsRes = await createNewTeams()
  if (!createNewTeamsRes.success) {
    return createNewTeamsRes
  }
  const setPlayersInactiveRes = await setPlayersInactive()
  if (!setPlayersInactiveRes.success) {
    return setPlayersInactiveRes
  }
  const updatePlayerSet1Res = await updatePlayerSet(values.Team1Players, values.Team1Name)
  if (!updatePlayerSet1Res.success) {
    return updatePlayerSet1Res
  }
  const updatePlayerSet2Res = await updatePlayerSet(values.Team2Players, values.Team2Name)
  if (!updatePlayerSet2Res.success) {
    return updatePlayerSet2Res
  }
  return { success: true }
};