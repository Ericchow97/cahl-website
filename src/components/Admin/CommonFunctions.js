import { createNewPlayerFetch } from './PlayerFetchFunctions'

export const addNewPlayers = async (allPlayers, team1Players, team2Players) => {
  for (let i = allPlayers.length - 1; i >= 0; i--) {
    if (allPlayers[i].newPlayer) {
      // only add player if player is in new team list
      if (team1Players.some(player => player.name === allPlayers[i].name) ||
        team2Players.some(player => player.name === allPlayers[i].name)) {
        const data = {
          name: allPlayers[i].name,
        }
        try {
          const res = await createNewPlayerFetch(data)
          if (res.ok) {
            const newPlayerData = await res.json()
            allPlayers[i].id = newPlayerData.id
            console.log('Success', newPlayerData)
          } else {
            throw new Error()
          }
        } catch (e) {
          return true
        }
      }
    } else return false
  }
}