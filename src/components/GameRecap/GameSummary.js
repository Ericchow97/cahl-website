import React from 'react'
import { Divider, Row, Col } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import { GameSummaryTable } from './GameSummaryTable'
import { CardTemplate } from '../CardTemplate'
import { ThreeStars } from './ThreeStars'
import { SeriesCard } from '../SeriesCard'

export const GameSummary = (props) => {

  const team1 = props.gameData.game_result[0]
  const team2 =  props.gameData.game_result[1]
  const game =  props.gameData.num
  const team1data = []
  const team2data = []
  props.gameData.game_result.forEach((team, i) => {
    team.players.forEach((player, j) => {
      const playerData = {
        key: j,
        player: player.player_name,
        goals: player.goals,
        assists: player.assists,
        points: player.points,
      }
      //if goalie, display in goalie section
      if (player.is_goalie) {
        playerData.ga = player.ga
      } else {
        playerData.ga = 0
      }
      // push data into teamNumData
      if (i === 0) {
        team1data.push(playerData)
      } else {
        team2data.push(playerData)
      }
    })
  })

  return (
    <>
        {props.threeStars.length === 3 ? (
          <>
            <h3>{props.gameData.game_summary.title}</h3>
            <Divider />
            <div>
              <CalendarOutlined style={{verticalAlign:"0.125em"}}/>
              <span className="div-pad date-font">{props.gameData.game_summary.game_date}</span>
            </div>
          </>
        ) : (
          <h1>Game Summary has not been created yet</h1>
        )}
          <CardTemplate header={`Game ${game}`} style={{textAlign:"center"}} headerAlign={true}>
            <SeriesCard 
              team1Name={team1.team_name}
              team2Name={team2.team_name}
              team1Score={team1.team_score}
              team2Score={team2.team_score}
              seriesId={props.gameData.series_id}
            />
          </CardTemplate>
        {props.threeStars.length === 3 &&
          <>
            <ThreeStars stars={props.threeStars}/>
            <Divider />
            <p>{props.gameData.game_summary.summary}</p>
          </>
        }
        <Divider />
        <h3>Game Stats</h3>
        <Row gutter={24}>
          <Col lg={12}>
            <h2>{team1.team_name}</h2>
            <GameSummaryTable data={team1data} />
          </Col>
          <Col lg={12}>
            <h2>{team2.team_name}</h2>
            <GameSummaryTable data={team2data} />
          </Col>
        </Row>        
    </>
  )
}