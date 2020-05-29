import React from 'react'
import { Redirect } from 'react-router'
import { Helmet } from 'react-helmet'
import { AdminPageInstance } from './components/AdminPage/AdminPageInstance'
import { CardTemplate } from './components/CardTemplate'

export const AdminPage = (props) => {
  if (!props.isAdmin) {
    return (
      <Redirect push to='/' />
    )
  } else {
    return (
      <>
        <Helmet>
          <title>Admin</title>
        </Helmet>
        <CardTemplate loading={props.isLoading} header={"Admin Page"}>
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