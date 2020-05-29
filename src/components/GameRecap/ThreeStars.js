import React from 'react'
import { Row } from 'antd'
import { StarCard } from './StarCard'


export const ThreeStars = (props) => {
    return (
        <>
            <Row type="flex" justify="center" style={{textAlign:"center", fontSize:"20px"}}>
                <StarCard stars="1" image={props.stars[0].image} name={props.stars[0].name}/>
                <StarCard stars="2" image={props.stars[1].image} name={props.stars[1].name}/>
                <StarCard stars="3" image={props.stars[2].image} name={props.stars[2].name}/>
            </Row>
        </>
    )
}