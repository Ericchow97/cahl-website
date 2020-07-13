import React from 'react'
import { Row } from 'antd'
import { StarCard } from './StarCard'


export const ThreeStars = (props) => {
    return (
        <>
            <Row type="flex" justify="center" style={{textAlign:"center", fontSize:"20px"}}>
                <StarCard stars="1" image={`https://6hbq50364a.execute-api.us-east-2.amazonaws.com/dev/media/${props.stars.first_star.image}`} name={props.stars.first_star.name}/>
                <StarCard stars="2" image={`https://6hbq50364a.execute-api.us-east-2.amazonaws.com/dev/media/${props.stars.second_star.image}`} name={props.stars.second_star.name}/>
                <StarCard stars="3" image={`https://6hbq50364a.execute-api.us-east-2.amazonaws.com/dev/media/${props.stars.third_star.image}`} name={props.stars.third_star.name}/>
            </Row>
        </>
    )
}