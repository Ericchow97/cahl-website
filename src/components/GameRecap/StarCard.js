import React from 'react'
import { Col } from 'antd'
import { StarFilled } from '@ant-design/icons'

export const StarCard = (props) => {

    const stars = []
    for (let i = 0; i < props.stars; i++) {
        stars.push(<StarFilled key = {i} style={{color:"gold", verticalAlign: '0.125em'}}/>)
    }

    return (
        <>
            <Col span={5} className="three-stars-border" key={props.stars}>
                {stars}
                <img src={props.image} alt="player" width="95%" height="200px"/>
                <h3>{props.name}</h3>
            </Col>
        </>
    )
}