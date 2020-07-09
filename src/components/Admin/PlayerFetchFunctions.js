export const createNewPlayerFetch = async (data) => {
  return await fetch(`http://127.0.0.1:8000/players/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const editPlayerFetch = async (data, id) => {
  return await fetch(`http://127.0.0.1:8000/players/${id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}

export const editPlayerImageFetch = async (data, id) => {
  return await fetch(`http://127.0.0.1:8000/players/${id}/`, {
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`
    },
    method: 'PATCH',
    body: data
  })
}

export const editPlayerImageFetchPublic = async (data, id) => {
  return await fetch(`http://127.0.0.1:8000/players/${id}/`, {
    method: 'PATCH',
    body: data
  })
}

export const deletePlayerFetch = async (id) => {
  return await fetch(`http://127.0.0.1:8000/players/${id}/`, {
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`
    },
    method: 'DELETE'
  })
}

export const createNewGameStatFetch = async (data) => {
  return await fetch(`http://127.0.0.1:8000/playerstats/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const editPlayerStatsFetch = async (data, id) => {
  return await fetch(`http://127.0.0.1:8000/playerstats/${id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}

export const deletePlayerStatsFetch = async (id) => {
  return await fetch(`http://127.0.0.1:8000/playerstats/${id}/`, {
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
    },
    method: 'DELETE'
  })
}