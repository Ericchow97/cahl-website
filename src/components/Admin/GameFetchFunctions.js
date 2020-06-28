// make a fetch post request to create the game
export const createNewGameFetch = async (data) => {
  return await fetch(`http://127.0.0.1:8000/game/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const editGameFetch = async (data, id) => {
  return await fetch(`http://127.0.0.1:8000/game/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const createNewGameSummaryFetch = async (data) => {
  return await fetch(`http://127.0.0.1:8000/gamesummary/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const editGameSummaryFetch = async (data, game_id) => {
  return await fetch(`http://127.0.0.1:8000/gamesummary/${game_id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

