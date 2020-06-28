import React from 'react';
import { Col } from 'antd'
import { SeriesGame } from './SeriesGame'

export const SeriesCarouselDisplay = (props) => {
  return (
    <Col
      span={props.span}
      key={props.id}
      className="border-series"
    >
      <SeriesGame
        id={props.id + 1}
        homeName={props.homeName}
        homeScore={props.homeScore}
        awayName={props.awayName}
        awayScore={props.awayScore}
      />
    </Col>
  )
} 