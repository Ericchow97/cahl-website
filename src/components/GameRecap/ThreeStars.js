import React from 'react'
import { Row } from 'antd'
import { StarCard } from './StarCard'


export const ThreeStars = () => {
    return (
        <>
            <Row type="flex" justify="center" style={{textAlign:"center", fontSize:"20px"}}>
                <StarCard stars="1" image="ericchow.gif" name="Eric Chow"/>
                <StarCard stars="2" image="chrischow.jpg" name="Chris Chow"/>
                <StarCard stars="3" image="Alex.jpg" name="Alex Chow"/>
            </Row>
        </>
    )
}