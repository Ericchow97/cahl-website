import React, { useEffect, useContext } from 'react'
import { Redirect } from 'react-router'
import { AdminContext } from './AdminContextProvider'

export const LogoutPage = () => {
  const adminContext = useContext(AdminContext)

  useEffect(() => {
    adminContext.changeAdmin(false)
    window.localStorage.clear()
  }, [adminContext])

  return (
    <Redirect push to="/" />
  )
}