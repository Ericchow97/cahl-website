import React from 'react';
import { MobileOrTablet } from '../../ResponsiveContextProvider'
import { Row, Col } from 'antd'

export const SeriesGame = (props) => {

  return (
    <>
    <Row className='game_carousel_heading'>
      {MobileOrTablet() ? (
        <h4>Game {props.id}</h4>
      ) : (
          <>
            <Col span={18}>
              <h4>Game {props.id}</h4>
            </Col>
            <Col span={6}>
              <h4>{props.homeScore > 0 || props.awayScore > 0 ? "Final" : "Sat"}</h4>
            </Col>
          </>
        )
      }
    </Row>
      <Row>
      <Col span={18}>
        <p className='game_carousel_team_name'>{props.homeName}</p>
        <p className='game_carousel_team_name'>{props.awayName}</p>
      </Col>
      <Col span={6}>
        <p className='game_carousel_team_name'>{props.homeScore}</p>
        <p className='game_carousel_team_name'>{props.awayScore}</p>
      </Col>
      </Row>
    </>
  )
}