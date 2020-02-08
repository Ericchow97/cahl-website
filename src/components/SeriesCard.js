import React from 'react';
import { Row, Col, Divider } from 'antd';

export const SeriesCard = (props) => {
    console.log(props.SeriesCarousel)
    return (
        <>
            {props.divider && <Divider />}
            <Row gutter={24}>
                <Col>
                    <h2>{props.title}</h2>
                </Col>
            </Row>
            <Row gutter={24}> 
                <Col span={10}>
                    <h2>{props.team1}</h2>
                </Col>
                <Col span={4}>
                    <h3 style={{margin: "7px"}}>VS</h3>
                </Col>
                <Col span={10}>
                    <h2>{props.team2}</h2>
                </Col>
            </Row>
            {props.captain &&
            <Row gutter={24}>
                <Col span={10}>
                    <p>Captain: {props.captain1}</p>
                </Col>
                <Col span={4}>
                    <h1></h1>
                </Col>
                <Col span={10}>
                    <p>Captain: {props.captain2}</p>
                </Col>
            </Row>
            }
            <Row gutter={24}>
                <Col span={10}>
                    <h1>{props.team1Score}</h1>
                </Col>
                <Col span={4}>
                    <h1>-</h1>
                </Col>
                <Col span={10}>
                    <h1>{props.team2Score}</h1>
                </Col>
            </Row>
            <Row>
                {props.SeriesCarousel && <props.SeriesCarousel /> }
            </Row>
            
        </>
    )
}