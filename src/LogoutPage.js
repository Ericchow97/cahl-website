import React from 'react'
import { Redirect } from 'react-router'

export const LogoutPage = (props) => {
  window.localStorage.clear()
  props.setAdmin(null)
  return (
    <Redirect push to = "/" />
  )
}