import React from 'react'
import { Divider, Row, Col } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import { GameSummaryTable } from './GameSummaryTable'
import { CardTemplate } from '../CardTemplate'
import { ThreeStars } from './ThreeStars'
import { SeriesCard } from '../SeriesCard'

export const GameSummary = (props) => {
  const team1 = props.gameInfo.game_result[0]
  const team2 = props.gameInfo.game_result[1]
  // push data to separate team to display in table
  const teamData = (teamPlayers) => {
    return teamPlayers.map((player, i) => {
      return {
        key: i,
        player: player.player_name,
        goals: player.goals,
        assists: player.assists,
        points: player.goals + player.assists,
        ga: player.ga
      }
    })
  }

  return (
    <>
      {props.gameInfo.game_summary.title ? (
        <>
          <h3>{props.gameInfo.game_summary.title}</h3>
          <Divider />
          <div>
            <CalendarOutlined style={{ paddingRight: '8px' }} />
            <span className="div-pad date-font">{props.gameInfo.game_summary.game_date}</span>
          </div>
        </>
      ) : (
          <h1>Game Summary has not been created yet</h1>
        )}
      <CardTemplate header={`Game ${props.gameInfo.num}`} style={{ textAlign: "center" }} headerAlign={true}>
        <SeriesCard
          team1Name={team1.team_name}
          team2Name={team2.team_name}
          team1Score={team1.team_score}
          team2Score={team2.team_score}
          seriesId={props.gameInfo.series_id}
        />
      </CardTemplate>
      {props.gameInfo.game_summary.title &&
        <>
          <ThreeStars stars={props.gameInfo.game_summary} />
          <Divider />
          <pre>{props.gameInfo.game_summary.summary}</pre>
        </>
      }
      <Divider />
      <h3>Game Stats</h3>
      <Row gutter={24}>
        <Col lg={12}>
          <h2>{team1.team_name}</h2>
          <GameSummaryTable data={teamData(team1.players)} />
        </Col>
        <Col lg={12}>
          <h2>{team2.team_name}</h2>
          <GameSummaryTable data={teamData(team2.players)} />
        </Col>
      </Row>
    </>
  )
}