export const createNewSeriesFetch = async (data) => {
  return await fetch(`http://127.0.0.1:8000/series/`, {
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
  return await fetch(`http://127.0.0.1:8000/series/${id}/`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Authorization': `Bearer ${window.localStorage.auth_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
}