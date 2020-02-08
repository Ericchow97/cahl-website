import React from 'react'
import { Icon, Col } from 'antd'

export const StarCard = (props) => {

    const stars = []
    for (let i = 0; i < props.stars; i++) {
        stars.push(<Icon type="star" theme="filled" style={{color:"gold", verticalAlign: '0.125em'}}/>)
    }

    return (
        <>
            <Col span={5} className="three-stars-border">
                {stars}
                <img src={require('../../assets/' + props.image)} alt="player" width="95%" height="200px"/>
                <h3>{props.name}</h3>
            </Col>
        </>
    )
}