import React from 'react'
import { Redirect } from 'react-router'
import { Helmet } from 'react-helmet'
import { AdminPageInstance } from './components/AdminPage/AdminPageInstance'
import { CardTemplate } from './components/CardTemplate'
import { IsAdmin } from './AdminContextProvider'

export const AdminPage = (props) => {
  if (!IsAdmin()) {
    return (
      <Redirect push to='/login' />
    )
  } else {
    return (
      <>
        <Helmet>
          <title>Admin</title>
        </Helmet>
        <CardTemplate loading={props.allSeriesLoading || props.gamesLoading} header={"Admin Page"}>
          <AdminPageInstance
            allSeries={props.allSeries}
            allGames={props.allGames}
            setSuccessfulSubmission={props.setSuccessfulSubmission}
            setAllGames={props.setAllGames}
          />
        </CardTemplate >
      </>
    )
  }
}