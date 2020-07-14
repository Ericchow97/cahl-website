import React, { useState, useEffect } from 'react'
import { Descriptions, Row, Col } from 'antd'
import { CardTemplate } from '../CardTemplate'
import { IsAdmin } from '../../AdminContextProvider'

export const SeriesView = (props) => {
  const [invalidSeries, setInvalidSeries] = useState(false)

  const [team1, setTeam1] = useState([])
  const [team2, setTeam2] = useState([])

  useEffect(() => {
    const seriesIndex = props.allSeries.findIndex(series => series.id === parseInt(props.seriesId))
    const seriesInfo = props.allSeries[seriesIndex]
    if (seriesInfo) {
      for (let team = 0; team < seriesInfo.teams.length; team++) {
        const captainIndex = seriesInfo.teams[team].players.findIndex(player => player.name === seriesInfo.teams[team].captain)
        seriesInfo.teams[team].players.splice(0, 0, seriesInfo.teams[team].players.splice(captainIndex, 1)[0])
      }
      setInvalidSeries(false)
      setTeam1(seriesInfo.teams[0])
      setTeam2(seriesInfo.teams[1])
    } else {
      setInvalidSeries(true)
    }
  }, [props.allSeries, props.seriesId])

  const createPlayerDescription = (teamPlayers) => {
    if (teamPlayers) {
      return teamPlayers.map((player, i) => {
        if (player.name === 'Oscar Chow') {
          player.num = String.fromCharCode(960)
        } else if (player.name === 'Chad Wenzel') {
          player.num = String.fromCharCode(937)
        }
        return (
          <Row gutter={[16, 16]} key={i}>
            <Col xs={10}>
              <img src={`https://zappa-uy1que6tl.s3.us-east-2.amazonaws.com/media/${player.image}`} alt="player" style={{ width: "100%", height: "100%", minWidth: '60px' }} />
            </Col>
            <Col xs={14}>
              <Descriptions column={1}>
                <Descriptions.Item label="Num" key={player.num}>{player.num}</Descriptions.Item>
                <Descriptions.Item key={player.name}>{player.name}</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        )
      })
    }
  }


  return (
    <>
      <CardTemplate
        loading={props.allSeriesLoading}
        header={`Series #${props.seriesId}`}
        extra={IsAdmin()}
        buttonText='Edit Series'
        handleClick={props.handleClick}
        disabled={invalidSeries}
      >
        {invalidSeries ? (
          <h1>This series does not exist</h1>
        ) : (
            <Row>
              <Col xs={12}>
                <h3>{team1.name}</h3>
                {createPlayerDescription(team1.players)}
              </Col>
              <Col xs={12}>
                <h3>{team2.name}</h3>
                {createPlayerDescription(team2.players)}
              </Col>
            </Row>
          )}
      </CardTemplate>
    </>
  )
}