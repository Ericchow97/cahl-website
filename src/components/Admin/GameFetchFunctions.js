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

export const createNewGameSummaryFetch = async (values, allPlayers, game_id) => {
  const firstStarIndex = allPlayers[allPlayers.findIndex(player => player.name === values.game_summary.star[0].name)].id
  const secondStarIndex = allPlayers[allPlayers.findIndex(player => player.name === values.game_summary.star[1].name)].id
  const thirdStarIndex = allPlayers[allPlayers.findIndex(player => player.name === values.game_summary.star[2].name)].id
  const data = {
    game: `http://127.0.0.1:8000/game/${game_id.id}/`,
    title: values.game_summary.title,
    summary: values.game_summary.summary,
    first_star: `http://127.0.0.1:8000/players/${firstStarIndex}/`,
    second_star: `http://127.0.0.1:8000/players/${secondStarIndex}/`,
    third_star: `http://127.0.0.1:8000/players/${thirdStarIndex}/`
  }
  return await fetch(`http://127.0.0.1:8000/gamesummary/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const editGameSummaryFetch = async (values, allPlayers, game_id) => {
  const firstStarIndex = allPlayers[allPlayers.findIndex(player => player.name === values.game_summary.star[0].name)].id
  const secondStarIndex = allPlayers[allPlayers.findIndex(player => player.name === values.game_summary.star[1].name)].id
  const thirdStarIndex = allPlayers[allPlayers.findIndex(player => player.name === values.game_summary.star[2].name)].id
  const data = {
    game_summary: {
      title: values.game_summary.title,
      summary: values.game_summary.summary,
      first_star: `http://127.0.0.1:8000/players/${firstStarIndex}/`,
      second_star: `http://127.0.0.1:8000/players/${secondStarIndex}/`,
      third_star: `http://127.0.0.1:8000/players/${thirdStarIndex}/`
    }
  }
  return await fetch(`http://127.0.0.1:8000/game/${game_id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const createNewGameStatFetch = async (data) => {
  return await fetch(`http://127.0.0.1:8000/playerstats/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}