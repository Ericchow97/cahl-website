import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet'
import { CardTemplate } from './components/CardTemplate'
import { GameSummary } from './components/GameRecap/GameSummary'
import { PrevSummary } from './components/GameRecap/PrevSummary'
import { Row, Col, Alert } from 'antd';
import { useParams } from 'react-router-dom'


export const GameRecap = (props) => {
  const [ adminRedirect, setAdminRedirect ] = useState(false)
  const [ redirect,  changeRedirect ] = useState(false)
  const { paramId } = useParams()
  const [ gameId, changeId ] = useState(paramId ? paramId : props.allGames.length)
  // used for rendering on click of other game summaries
  const [ isLoading, setLoading ] = useState(true)
  const [ threeStars, setThreeStars ] = useState([])

  //API request to server to obtain three stars
  useEffect(() => {
    const fetchThreeStarsData = async () => {
      const firstStarRes = await fetch(`${gameData.game_summary.first_star}?player_info=true`)
      const firstStar = await firstStarRes.json()
      const secondStarRes = await fetch(`${gameData.game_summary.second_star}?player_info=true`)
      const secondStar = await secondStarRes.json()
      const thirdStarRes = await fetch(`${gameData.game_summary.third_star}?player_info=true`)
      const thirdStar = await thirdStarRes.json()
      setThreeStars(firstStar)
      setThreeStars(threeStars => [threeStars, secondStar])
      setThreeStars(threeStars => [...threeStars, thirdStar])
      setLoading(false)
    }
    const gameData = props.allGames[props.allGames.length - gameId]
    // if its has a value, then get the data
    if (gameData && gameData.game_summary) {
      fetchThreeStarsData()
    } else {
      setThreeStars([])
      setLoading(false)
    }
  }, [gameId, props.isLoading])

  const handleClick = (id) => {
    changeId(id)
    changeRedirect(true)
    setThreeStars([])
    setLoading(true)
  }

  const handleAdminClick = () => {
    setAdminRedirect(true)
  }

  const handleClose = () => {
    props.setGameSuccess()
  }

  // initially set the id to the most recent game
  useEffect(() => {
      changeId(props.allGames.length)
  }, [props.allGames])
  
  return (
    <>
      <Helmet>
        <title>{gameId ? `Game Recap #${gameId}` : `Game Recap`}</title>
      </Helmet>
      {redirect && <Redirect push to={`/gameRecap/${gameId}`}/>}
      {adminRedirect && <Redirect push to = {`/gameRecap/${gameId}/admin/editGame`}/>}
      {props.gameSuccess && 
        <Alert 
            message={props.gameSuccess}
            type="success"
            closable
            showIcon
            afterClose={handleClose}
        />
      }
      <Row gutter={16}>
        <Col span={18}>
          <CardTemplate
            loading={props.isLoading || isLoading}
            header="Game Recap" 
            extra={props.isAdmin} 
            buttonText='Edit Game' 
            handleClick={handleAdminClick}
          >
            <GameSummary
                gameId={gameId}
                gameData={props.allGames[props.allGames.length - gameId]}
                isAdmin={props.isAdmin}
                threeStars={threeStars}
                isLoading={isLoading}
                setLoading={setLoading}
            />
            </CardTemplate>
        </Col>
        <Col span={6}>
          <CardTemplate 
            loading={props.isLoading}
            header="Previous Recaps" 
            headSize="20px"
          >
            <PrevSummary 
                handleClick={handleClick}
                allGames={props.allGames}
            />
          </CardTemplate>
        </Col>
      </Row>
    </>
  )   
}
