import React from 'react'
import { StatsTable } from './StatsTable'
import { Row, Col } from 'antd';

export const SeriesStats = (props) => {
  const team1 = []
  const team2 = []
  const team1Name = props.currentSeries.teams[0].name
  const team2Name = props.currentSeries.teams[1].name
  props.currentSeriesStats.forEach((player, i) => {
    const playerStats = {
      key: i,
      id: player.id,
      num: player.num,
      player: player.name,
      games: player.games,
      goals: player.goals,
      assists: player.assists,
      points: player.goals + player.assists,
      wins: player.wins,
      loss: player.is_goalie - player.wins,
    }
    if (player.is_goalie > 0) {
      playerStats.gaa = Math.round((player.ga / player.is_goalie + Number.EPSILON) * 100) / 100
    } else {
      playerStats.gaa = 0
    }
    if (player.current_team_id % 2) {
      team2.push(playerStats)
    } else {
      team1.push(playerStats)
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