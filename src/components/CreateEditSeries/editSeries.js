import { editSeriesFetch } from '../Admin/SeriesFetchFunctions'
import { addNewPlayers } from '../Admin/CommonFunctions'
import { editPlayerFetch } from '../Admin/PlayerFetchFunctions'
import { fetchRequest } from '../Admin/CommonFunctions'

export const editSeries = async (values, allPlayers, team1, team2, seriesId, context) => {

  // updates team instances with new players
  const changeTeamName = async () => {
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
    const ret = await fetchRequest(editSeriesFetch, context, 'update', { data: newSeriesData, id: seriesId })
    if (!ret.success) {
      return ret
    }
    return { success: true }
  }

  // create/update each player in player list 
  const updatePlayerSet = async (newPlayers, otherPlayers, oldPlayers, teamName) => {
    // compare each new player to old player list, if not on the list, add them to the team
    for (let i = 0; i < newPlayers.length; i++) {
      let oldPlayerIndex = 0
      // if player is old player list, remove player from the list
      if (oldPlayers.some((player, j) => { oldPlayerIndex = j; return player.name === newPlayers[i].name })) {
        oldPlayers.splice(oldPlayerIndex, 1)
      } else { // add player to the team
        const playerIndex = allPlayers.findIndex(player => player.name === newPlayers[i].name)
        const playerInfo = allPlayers[playerIndex]
        const data = {
          current_team: teamName,
          is_active: true
        }
        const ret = await fetchRequest(editPlayerFetch, context, 'update', { data: data, id: playerInfo.id })
        if (!ret.success) {
          return ret
        }
      }
    }
    // for remaining players in old player list, if on neither team, set them to inactive
    for (let i = 0; i < oldPlayers.length; i++) {
      if (!otherPlayers.some(player => player.name === oldPlayers[i].name)) {
        const playerIndex = allPlayers.findIndex(player => player.name === oldPlayers[i].name)
        const playerInfo = allPlayers[playerIndex]
        const data = {
          current_team: null,
          is_active: false
        }
        const ret = await fetchRequest(editPlayerFetch, context, 'update', { data: data, id: playerInfo.id })
        if (!ret.success) {
          return ret
        }
      }
    }
    return { success: true }
  }

  const addNewPlayersRes = await addNewPlayers(allPlayers, values.Team1Players, values.Team2Players)
  if (!addNewPlayersRes.success) {
    return addNewPlayersRes
  }
  const changeTeamNameRes = await changeTeamName()
  if (!changeTeamNameRes.success) {
    return changeTeamNameRes
  }
  const updatePlayerSet1Res = await updatePlayerSet(values.Team1Players, values.Team2Players, team1.players, values.Team1Name)
  if (!updatePlayerSet1Res.success) {
    return updatePlayerSet1Res
  }
  const updatePlayerSet2Res = await updatePlayerSet(values.Team2Players, values.Team1Players, team2.players, values.Team2Name)
  if (!updatePlayerSet2Res.success) {
    return updatePlayerSet2Res
  }

  return { success: true }
};