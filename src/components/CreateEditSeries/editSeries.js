import { editSeriesFetch } from '../Admin/SeriesFetchFunctions'
import { createNewPlayerFetch, editPlayerFetch, deletePlayerFetch } from '../Admin/PlayerFetchFunctions'

export const editSeries = async (values, allPlayers, team1, team2, team1Players, team2Players, seriesId) => {
  const changeTeamName = (team1.name !== values.Team1Name || 
    team2.name !== values.Team2Name ||
    team1.captain !== values.Team1Players[0].name ||
    team2.captain !== values.Team2Players[0].name
  ) 
  let fetchErr = false
  // if team name or captains change for either team, make a patch request to series
  if (changeTeamName) {
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
      const res = await editSeriesFetch(newSeriesData, seriesId)
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
    return
  }

  // loop through new team and make post/patch requests to each player in list of players
  const updatePlayerSet = async (newTeamPlayers, teamName) => {
    // loop through all new players
    for (let i = 0; i < newTeamPlayers.length; i++) {
      const playerIndex = allPlayers.findIndex(player => player.name === newTeamPlayers[i].name)
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
      // if player is an existing player then make a patch request
      else {
        const team1NameIndex = playerInfo.prev_teams.findIndex(team => team === team1.name)
        const team2NameIndex = playerInfo.prev_teams.findIndex(team => team === team2.name)
        // player was on team 1, but new team name is not the same as team 1
        const team1ToTeam2 = (playerInfo.prev_teams[team1NameIndex] !== undefined && playerInfo.prev_teams[team1NameIndex] !== teamName)
        // player was on team 2, but new team name is not the same as team 2
        const team2ToTeam1 = (playerInfo.prev_teams[team2NameIndex] !== undefined && playerInfo.prev_teams[team2NameIndex] !== teamName)
        // player was on neither team 1 nor team 2
        const isNewAddition = (playerInfo.prev_teams[team1NameIndex] === undefined && playerInfo.prev_teams[team2NameIndex] === undefined)
        //TODO PERFORMANCE: only make request if team name has changed for the player team
        // if team name has changed OR player has changed teams OR is a new existing player create a patch request to the player
        if (changeTeamName || team1ToTeam2 || team2ToTeam1 || isNewAddition) {
          // if changed from one team to antoher, replace the old name with the new name
          if (!isNewAddition) {
            const replaceIndex = team1NameIndex >= 0 ? team1NameIndex : team2NameIndex 
            playerInfo.prev_teams.splice(replaceIndex, 1, teamName)
          } else {
            playerInfo.prev_teams.push(teamName)
          }
          const data = {
            current_team: teamName,
            is_active: true,
            all_teams: playerInfo.prev_teams
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
      }
      if (fetchErr) {
        break
      }
    }
  }

  //if player is on neither team, either delete player or remove existence from team
  const updateOldPlayers = async (oldTeamPlayers, newTeam1Players, newTeam2Players) => {
    // loop through all old players
    for (let i = 0; i < oldTeamPlayers.length; i++) {
      // loop through new list of players on both teams, if old player is in either team, return true, else return false
      const oldPlayerExist = (newTeam1Players.some(newPlayerName => newPlayerName.name === oldTeamPlayers[i].name) || 
                              newTeam2Players.some(newPlayerName => newPlayerName.name === oldTeamPlayers[i].name))
      // if old player is in neither team, perform delete request or patch request
      if (!oldPlayerExist) {
        // delete if previous team length === 1
        if (oldTeamPlayers[i].all_teams.length === 1) {
          try {
            const res = await deletePlayerFetch(oldTeamPlayers[i].id)
            if (res.ok) {
              console.log('Success Delete')
            } else {
              throw new Error()
            }
          } catch {
            fetchErr = true
          }
        }
        // patch request to remove team from current team and all_teams if its previous team length is greater than 1
        else {
          const team1NameIndex = oldTeamPlayers[i].all_teams.findIndex(team => team === team1.name)
          const team2NameIndex = oldTeamPlayers[i].all_teams.findIndex(team => team === team2.name)
          if (team1NameIndex >= 0) {
            oldTeamPlayers[i].all_teams.splice(team1NameIndex, 1)
          } else if (team2NameIndex >= 0) {
            oldTeamPlayers[i].all_teams.splice(team2NameIndex, 1)
          }
          const data = {
            current_team: null,
            is_active: false,
            all_teams: oldTeamPlayers[i].all_teams
          }
          try {
            const res = await editPlayerFetch(data, oldTeamPlayers[i].id)
            if (res.ok) {
              console.log('Success Edit', await res.json())
            } else {
              throw new Error()
            }
          } catch {
            fetchErr = true
          }
        }
      }
    }
  }
  await updatePlayerSet(values.Team1Players, values.Team1Name)
  await updatePlayerSet(values.Team2Players, values.Team2Name)
  updateOldPlayers(team1Players, values.Team1Players, values.Team2Players)
  updateOldPlayers(team2Players, values.Team1Players, values.Team2Players)

  return !fetchErr
};