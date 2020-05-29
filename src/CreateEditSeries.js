import React from 'react'
import { Redirect } from 'react-router'
import { Helmet } from 'react-helmet'
import { SeriesInstance } from './components/CreateEditSeries/SeriesInstance'
import { CardTemplate } from './components/CardTemplate'
import { useParams } from 'react-router-dom'

export const CreateEditSeries = (props) => {
  let { seriesId } = useParams()

  if (!props.isAdmin) {
    return (
      <Redirect push to='/' />
    )
  } else {
    return (
      <>
      <Helmet>
        <title>{props.edit ? `Edit Series #${seriesId}` : "Create New Series"}</title>
      </Helmet>
        <CardTemplate loading={props.isLoading} header={props.edit ? `Edit Series #${seriesId}` : "Create New Series"}>
          <SeriesInstance
            setSuccessfulSubmission={props.setSuccessfulSubmission}
            setSeriesSuccess={props.setSeriesSuccess}
            allSeries={props.allSeries}
            seriesId={seriesId}
            edit={props.edit}
          />
        </CardTemplate >
      </>
    )
  }
}

