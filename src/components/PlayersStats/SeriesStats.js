import React from 'react'
import { CardTemplate } from '../CardTemplate'
import { StatsTable } from './StatsTable'
import { Row, Col } from 'antd';

export const SeriesStats = (props) => {
  const team1 = [
    {
      key: "1",
      id: "99",
      player: "Eric Chow",
      games: "7",
      goals: "100",
      assists: "10",
      points: "1000",
      wins: "10",
      loss: "0",
      gaa: "2"
    },
    {
      key: "2",
      id: "92",
      player: "arwef Chow",
      games: "7",
      goals: "100",
      assists: "10",
      points: "100",
      wins: "10",
      loss: "0",
      gaa: "2"
    },
    {
      key: "3",
      id: "99",
      player: "Ericewefwef Chow",
      games: "7",
      goals: "99",
      assists: "10",
      points: "100",
      wins: "10",
      loss: "0",
      gaa: "2"
    }
  ];
  const team2 = [
    {
      key: "1",
      id: "99",
      player: "Eric Chow",
      games: "7",
      goals: "100",
      assists: "10",
      points: "1000",
      wins: "10",
      loss: "0",
      gaa: "2"
    },
    {
      key: "2",
      id: "92",
      player: "arwef Chow",
      games: "7",
      goals: "100",
      assists: "10",
      points: "100",
      wins: "10",
      loss: "0",
      gaa: "2"
    },
    {
      key: "3",
      id: "99",
      player: "Ericewefwef Chow",
      games: "7",
      goals: "19",
      assists: "10",
      points: "100",
      wins: "10",
      loss: "0",
      gaa: "2"
    }
  ];
  return (
    <>
        <CardTemplate header="Current Series Stats">
          <Row gutter={24}>
            <Col lg={12}>
              <h2>Team Name 1</h2>
              <StatsTable data={team1} handleClick={props.handleClick} />
            </Col>
            <Col lg={12}>
              <h2>Team Name 2</h2>
              <StatsTable data={team2} handleClick={props.handleClick} />
            </Col>
          </Row>
        </CardTemplate>
    </>
  )
}