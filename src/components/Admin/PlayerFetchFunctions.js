export const createNewPlayerFetch = async (data) => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/players/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const editPlayerFetch = async (data, id) => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/players/${id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}

export const editPlayerImageFetch = async (data, id) => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/players/${id}/`, {
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`
    },
    method: 'PATCH',
    body: data
  })
}

export const editPlayerImageFetchPublic = async (data, id) => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/players/${id}/`, {
    method: 'PATCH',
    body: data
  })
}

export const deletePlayerFetch = async (id) => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/players/${id}/`, {
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`
    },
    method: 'DELETE'
  })
}

export const createNewGameStatFetch = async (data) => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/playerstats/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export const editPlayerStatsFetch = async (data, id) => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/playerstats/${id}/`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}

export const deletePlayerStatsFetch = async (id) => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/playerstats/${id}/`, {
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
    },
    method: 'DELETE'
  })
}