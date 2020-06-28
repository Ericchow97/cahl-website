import React from 'react'
import { Redirect } from 'react-router'
import { Helmet } from 'react-helmet'
import { AdminPageInstance } from './components/AdminPage/AdminPageInstance'
import { CardTemplate } from './components/CardTemplate'

export const AdminPage = (props) => {
  //TODO: Set up fetch for more games
  if (!props.isAdmin) {
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
            edit={props.edit}
          />
        </CardTemplate >
      </>
    )
  }
}