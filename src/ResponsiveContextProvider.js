import React, { useState, useEffect, createContext, useContext } from 'react';

const ResponsiveContext = createContext()

export const ResponsiveContextProvider = ({ children }) => {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize)}
  }, [])

  return (
    <ResponsiveContext.Provider value={width}>
      {children}
    </ResponsiveContext.Provider>
  )
}

export const MobileOrTablet = () => {
  return useContext(ResponsiveContext) < 720
}

export const Mobile = () => {
  return useContext(ResponsiveContext) < 500
}