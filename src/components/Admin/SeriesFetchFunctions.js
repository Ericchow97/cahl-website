export const createNewSeriesFetch = async (data) => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/series/`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}

export const editSeriesFetch = async (data, id) => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/series/${id}/`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}