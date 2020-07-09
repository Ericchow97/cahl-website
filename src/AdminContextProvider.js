import React, { useState, createContext, useContext } from 'react';

export const AdminContext = createContext()

export const AdminContextProvider = ({ children }) => {
  const [isAdmin, setAdmin] = useState(window.localStorage.getItem('admin'))

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        changeAdmin: (val) => { setAdmin(val); val === false && window.localStorage.clear() }
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const IsAdmin = () => {
  return useContext(AdminContext).isAdmin
}
