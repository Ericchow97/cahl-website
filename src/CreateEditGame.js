import React from 'react'
import { Redirect } from 'react-router'
import { Helmet } from 'react-helmet'
import { GameInstance } from './components/CreateNewEditGame/GameInstance'
import { CardTemplate } from './components/CardTemplate'

export const CreateEditGame = (props) => {
  if (!props.isAdmin) {
    return (
      <Redirect push to='/' />
    )
  } else {
    return (
      <>
      <Helmet>
        <title>{props.edit ? "Edit Game" : "Create New Game"}</title>
      </Helmet>
      {/*TODO: add game number && series to edit game*/} 
        <CardTemplate loading={props.isLoading} header={props.edit ? "Edit Game" : "Create New Game"}>
          <GameInstance
            allSeries={props.allSeries}
            setSuccessfulSubmission={props.setSuccessfulSubmission}
            edit={props.edit}
            setGameSuccess={props.setGameSuccess}
          />
        </CardTemplate >
      </>
    )
  }
}