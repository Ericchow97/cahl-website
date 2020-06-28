import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { SeriesView } from './components/TeamView/SeriesView'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router';

export const TeamView = (props) => {
  let { seriesId } = useParams()

  const [adminRedirect, setAdminRedirect] = useState(false)

  const handleClick = () => {
    setAdminRedirect(true)
  }

  return (
    <>
      <Helmet>
        <title>{`Series #${seriesId}`}</title>
      </Helmet>
      {adminRedirect && <Redirect push to={`/teams/${seriesId}/admin/editTeams`} />}
      <SeriesView
        isAdmin={props.isAdmin}
        seriesId={seriesId}
        allSeries={props.allSeries}
        handleClick={handleClick}
      />
    </>
  )
}