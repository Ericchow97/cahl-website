import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet'
import { CardTemplate } from './components/CardTemplate'
import { GameSummary } from './components/GameRecap/GameSummary'
import { PrevSummary } from './components/GameRecap/PrevSummary'
import { Button, Drawer } from 'antd';
import { useParams } from 'react-router-dom'
import { IsAdmin } from './AdminContextProvider'

export const GameRecap = (props) => {
  let { gameId } = useParams()

  const [adminRedirect, setAdminRedirect] = useState(false)
  const [redirect, changeRedirect] = useState(false)

  const [currentGameId, changeId] = useState(gameId)
  const [gameInfo, setGameInfo] = useState({})
  const [invalidGame, setInvalidGame] = useState(false)

  // Drawer variable
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const gameRes = await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/game/${currentGameId}/`)
        if (gameRes.ok) {
          setGameInfo(await (gameRes).json())
          setInvalidGame(false)
        } else {
          throw new Error()
        }
      }
      catch {
        setInvalidGame(true)
      }
    }
    if (!currentGameId && props.allGames[0]) {
      changeId(props.allGames[0].id)
    }
    const gameIndex = props.allGames.findIndex(game => game.id === parseInt(currentGameId))
    let game = props.allGames[gameIndex]
    // if previous games and game summary exist, then get the data
    if (game) {
      setInvalidGame(false)
      setGameInfo(game)
    } else if (currentGameId) {
      game = fetchGame()
    }
  }, [currentGameId, props.allGames])

  const handleClick = (id) => {
    if (id !== currentGameId) {
      changeId(id)
      changeRedirect(true)
      setVisible(false)
    }
  }

  const handleAdminClick = () => {
    setAdminRedirect(true)
  }

  //Mobile Drawer functions
  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  return (
    <>
      <Helmet>
        <title>{`Game Recap`}</title>
      </Helmet>
      {redirect && <Redirect push to={`/gameRecap/${currentGameId}`} />}
      {adminRedirect && <Redirect push to={`/gameRecap/${currentGameId}/admin/editGame`} />}
      <CardTemplate
        loading={props.gamesLoading || (!gameInfo.game_result && !invalidGame)}
        header="Game Recap"
        extra={IsAdmin()}
        buttonText='Edit Game'
        handleClick={handleAdminClick}
        disabled={invalidGame}
      >
        {invalidGame ? (
          <h1>This game does not exist</h1>
        ) : (
            <GameSummary
              gameInfo={gameInfo}
            />
          )
        }
        <Button
          type="primary"
          style={{ marginBottom: '24px' }}
          block
          onClick={showDrawer}
        >
          See Previous Recaps
          </Button>
        <Drawer
          title="Previous Recaps"
          placement="right"
          headerStyle={{
            backgroundImage: "linear-gradient(to right, rgb(30,30,30) , red)",
            fontSize: "24px"
          }}
          bodyStyle={{ backgroundColor: "black", padding: '8px' }}
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <PrevSummary
            handleClick={handleClick}
            allGames={props.allGames}
            setAllGames={props.setAllGames}
          />
        </Drawer>
      </CardTemplate>
    </>
  )
}
