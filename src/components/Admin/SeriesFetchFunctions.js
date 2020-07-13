export const createNewSeriesFetch = async (data) => {
  return await fetch(`https://6hbq50364a.execute-api.us-east-2.amazonaws.com/dev/series/`, {
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
  return await fetch(`https://6hbq50364a.execute-api.us-east-2.amazonaws.com/dev/series/${id}/`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}