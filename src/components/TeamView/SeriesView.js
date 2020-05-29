import React from 'react'
import { Descriptions, Row, Col } from 'antd';

export const SeriesView = (props) => {

  const createPlayerDescription = (teamPlayers) => {
    const allTeamPlayers = teamPlayers.map((player, i) => {
      return (
        <Row gutter= {[16, 16]} key={i}>
          <Col xs={6}>
              <img src={player.image} alt="player" width="100%" height="100%"/>
          </Col>
          <Col xs={18}>
            <Descriptions column={1}>
              <Descriptions.Item label="Number" key={player.num}>{player.num}</Descriptions.Item>
              <Descriptions.Item label="Name" key={player.name}>{player.name}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      )
    })
    return allTeamPlayers
  }

  //TODO: if invalid series, should redirect to 404 page
  if (props.invalidSeries) {
    return <h1>This series does not exist</h1>
  } 
  else {
    return (
      <>
          <Row>
            <Col xs={12}>
              <h3>{props.seriesTeams.teams[0].name}</h3>
              {createPlayerDescription(props.team1Players)}
            </Col>
            <Col xs={12}>
              <h3>{props.seriesTeams.teams[1].name}</h3>
              {createPlayerDescription(props.team2Players)}
            </Col>
          </Row>
      </>
    )
  }  
}