import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet'
import { Row, Col } from 'antd';
import { ScoringLeaders } from './components/Home/ScoringLeaders';
import { SeriesHome } from "./components/Home/SeriesHome";
import { GameRecapSummary } from "./components/Home/GameRecapSummary";
import { CardTemplate } from './components/CardTemplate'
import { IsAdmin } from './AdminContextProvider'

export const Home = (props) => {
  // require call to API for scoring leaders and recap of game
  const [playerRedirect, changePlayerRedirect] = useState(false)
  const [adminRedirect, setAdminRedirect] = useState(false)

  const [playerId, changeId] = useState(null)
  const [gameSummaryRedirect, changeGameSummaryRedirect] = useState(false)

  const handleClick = (record) => {
    if (record.target && record.target.name === 'gameSummary') {
      changeGameSummaryRedirect(true)
    } else {
      changePlayerRedirect(true)
      changeId(record.id)
    }
  }

  const handleAdminClick = () => {
    setAdminRedirect(true)
  }

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      {gameSummaryRedirect && <Redirect push to='/gameRecap/' />}
      {playerRedirect && <Redirect push to={"/players/" + playerId} />}
      {adminRedirect && <Redirect push to='/admin/newGame' />}
      <Row gutter={24}>
        <Col lg={12}>
          <CardTemplate
            loading={props.homeLoading}
            header="Current Series"
            style={{ textAlign: "center" }}
            extra={IsAdmin()}
            buttonText='New Game'
            handleClick={handleAdminClick}
          >
            <SeriesHome
              currentSeries={props.currentSeries}
            />
          </CardTemplate>
        </Col>
        <Col lg={12} style={{ width: '100%' }}>
          <CardTemplate loading={props.homeLoading} header="Scoring Leaders">
            <ScoringLeaders
              topScorers={props.topScorers}
              handleClick={handleClick}
            />
          </CardTemplate>
        </Col>
      </Row>
      <CardTemplate loading={props.homeLoading} header="Game Recap">
        <GameRecapSummary
          recentGame={props.recentGame}
          handleClick={handleClick}
        />
      </CardTemplate>
    </>
  )
}
