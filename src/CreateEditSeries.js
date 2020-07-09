import React from 'react'
import { Redirect } from 'react-router'
import { Helmet } from 'react-helmet'
import { SeriesInstance } from './components/CreateEditSeries/SeriesInstance'
import { CardTemplate } from './components/CardTemplate'
import { useParams } from 'react-router-dom'
import { IsAdmin } from './AdminContextProvider'

export const CreateEditSeries = (props) => {
  let { seriesId } = useParams()

  if (!IsAdmin()) {
    return (
      <Redirect push to='/login' />
    )
  } else {
    return (
      <>
        <Helmet>
          <title>{seriesId ? `Edit Series #${seriesId}` : "Create New Series"}</title>
        </Helmet>
        <CardTemplate loading={props.playersLoading || props.allSeriesLoading} header={seriesId ? `Edit Series #${seriesId}` : "Create New Series"}>
          <SeriesInstance
            allPlayers={props.allPlayers}
            allSeries={props.allSeries}
            seriesId={seriesId}
            setSuccessfulSubmission={props.setSuccessfulSubmission}
          />
        </CardTemplate >
      </>
    )
  }
}

