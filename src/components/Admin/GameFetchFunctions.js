// make a fetch post request to create the game
export const createNewGameFetch = async (data) => {
  return await fetch(`https://6hbq50364a.execute-api.us-east-2.amazonaws.com/dev/game/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const editGameFetch = async (data, id) => {
  return await fetch(`https://6hbq50364a.execute-api.us-east-2.amazonaws.com/dev/game/${id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const createNewGameSummaryFetch = async (data) => {
  return await fetch(`https://6hbq50364a.execute-api.us-east-2.amazonaws.com/dev/gamesummary/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const editGameSummaryFetch = async (data, game_id) => {
  return await fetch(`https://6hbq50364a.execute-api.us-east-2.amazonaws.com/dev/gamesummary/${game_id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

