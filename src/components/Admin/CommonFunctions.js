import { createNewPlayerFetch } from './PlayerFetchFunctions'

/*
  General fetch function for admin CUD functions
  @ callback(func) - fetch function for CUD operations
  @ context(context) - allow changes to global state of authentication
  @ type(str) - 'create', 'update', 'delete'
  @ obj(obj) - contains data (obj) to update and id(int) for specific ID
  return(bool) - lets user know of an error
*/
export const fetchRequest = async (callback, context, type, obj) => {
  try {
    let res
    switch (type) {
      case 'create':
        res = await callback(obj.data)
        break;
      case 'update':
        res = await callback(obj.data, obj.id)
        break;
      case 'delete':
        res = await callback(obj.id)
        break;
      default:
        throw new Error('invalid type')
    }
    if (res.ok) {
      if (res.status === 204) {
        return {
          success: true,
        }
      }
      const data = await res.json()
      console.log('Success', data)
      return {
        success: true,
        data: data
      }
    } else {
      // access token has expired
      if (res.status === 401) {
        const success = await refreshToken()
        if (success) {
          return await fetchRequest(callback, context, type, obj)
        } else {
          // refresh Token Expired
          context.changeAdmin(false)
          return {
            success: false,
            error: 0,
            message: 'Please re-login'
          }
        }
      } else {
        return {
          success: false,
          message: 'Invalid Entry'
        }
      }
    }
  } catch (err) {
    console.log(err)
    return {
      success: false,
      message: 'Server Error. Please refresh and try again'
    }
  }
}

export const refreshToken = async () => {
  return await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/api/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refresh: window.localStorage.getItem('refresh_token') })
  })
    .then(res => {
      // refresh token has expired
      if (!res.ok) {
        throw new Error()
      }
      return res.json()
    })
    .then(data => {
      const jwt_token = data
      window.localStorage.setItem('auth_token', jwt_token.access)
      return true
    })
    .catch(() => {
      return false
    })
}

export const addNewPlayers = async (allPlayers, team1Players, team2Players, context) => {
  for (let i = allPlayers.length - 1; i >= 0; i--) {
    if (allPlayers[i].newPlayer) {
      // only add player if player is in new team list
      if (team1Players.some(player => player.name === allPlayers[i].name) ||
        team2Players.some(player => player.name === allPlayers[i].name)) {
        const data = {
          name: allPlayers[i].name,
        }
        const ret = await fetchRequest(createNewPlayerFetch, context, 'create', { data: data })
        if (!ret.success) {
          return ret
        } else {
          allPlayers[i].id = ret.data.id
        }
      }
    } else return { success: true }
  }
}

