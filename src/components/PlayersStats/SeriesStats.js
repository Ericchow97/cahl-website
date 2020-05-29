import React from 'react'
import { StatsTable } from './StatsTable'
import { Row, Col } from 'antd';

export const SeriesStats = (props) => {
  const team1 = []
  const team2 = []
  const team1Name = props.activeSeries.teams[0].name
  const team2Name = props.activeSeries.teams[1].name
  props.activePlayersStats.forEach((player, i) => {
    const playerStats = {
      key: i,
      id: player.id,
      num: player.num,
      player: player.name,
      games: player.games,
      goals: player.goals,
      assists: player.assists,
      points: player.points,
      wins: player.wins,
      loss: player.loss,
    }
    if (player.goalieGames > 0 ) {
      playerStats.gaa = player.ga/player.goalieGames
    } else {
      playerStats.gaa = 0
    }
    if (player.team === team1Name) {
      team1.push(playerStats)
    } else if (player.team === team2Name) {
      team2.push(playerStats)
    }
  });

  return (
    <>
      <Row gutter={24}>
        <Col lg={12}>
          <h2>{team1Name}</h2>
          <StatsTable data={team1} handleClick={props.handleClick} />
        </Col>
        <Col lg={12}>
          <h2>{team2Name}</h2>
          <StatsTable data={team2} handleClick={props.handleClick} />
        </Col>
      </Row>
    </>
  )
  
}