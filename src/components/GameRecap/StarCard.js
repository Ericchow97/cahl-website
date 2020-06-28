import React from 'react'
import { Col } from 'antd'
import { StarFilled } from '@ant-design/icons'
import {Mobile} from '../../ResponsiveContextProvider'

export const StarCard = (props) => {

    const stars = []
    for (let i = 0; i < props.stars; i++) {
        stars.push(<StarFilled key = {i} style={{color:"gold", verticalAlign: '0.125em'}}/>)
    }

    return (
        <>
            <Col span={Mobile() ? 8 : 7} className="three-stars-border" key={props.stars}>
                <div width='100%'>
                    {stars}
                </div>
                <img src={props.image} alt="player" style={{height: 'auto', maxHeight: '200px', width: '95%', maxWidth: '150px'}}/>
                <h3>{props.name}</h3>
            </Col>
        </>
    )
}