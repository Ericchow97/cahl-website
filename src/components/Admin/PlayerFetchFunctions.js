export const createNewPlayerFetch = async (data) => {
  return await fetch(`http://127.0.0.1:8000/players/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const editPlayerFetch = async (data, id) => {
  return await fetch(`http://127.0.0.1:8000/players/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}

export const editPlayerImageFetch = async (data, id) => {
  return await fetch(`http://127.0.0.1:8000/players/${id}/`, {
    method: 'PATCH',
    body: data
  })
}

export const deletePlayerFetch = async (id) => {
  return await fetch(`http://127.0.0.1:8000/players/${id}/`, {
    method: 'DELETE'
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

export const editPlayerStatsFetch = async (data, id) => {
  return await fetch(`http://127.0.0.1:8000/playerstats/${id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}

export const deletePlayerStatsFetch = async (id) => {
  return await fetch(`http://127.0.0.1:8000/playerstats/${id}/`, {
    method: 'DELETE'
  })
}