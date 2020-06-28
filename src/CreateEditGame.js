import React from 'react'
import { Redirect } from 'react-router'
import { Helmet } from 'react-helmet'
import { GameInstance } from './components/CreateNewEditGame/GameInstance'
import { CardTemplate } from './components/CardTemplate'
import { useParams } from 'react-router-dom'

export const CreateEditGame = (props) => {
  const { gameId } = useParams()

  if (!props.isAdmin) {
    return (
      <Redirect push to='/' />
    )
  } else {
    return (
      <>
        <Helmet>
          <title>{gameId ? "Edit Game" : "Create New Game"}</title>
        </Helmet>
        <CardTemplate loading={props.homeLoading || props.playersLoading || props.gamesLoading} header={gameId ? "Edit Game" : "Create New Game"}>
          <GameInstance
            currentSeries={props.currentSeries} // New Game
            allPlayers={props.allPlayers} //Player select list
            allGames={props.allGames}
            gameId={gameId}
            setSuccessfulSubmission={props.setSuccessfulSubmission}
            setGameSuccess={props.setGameSuccess}
          />
        </CardTemplate >
      </>
    )
  }
}