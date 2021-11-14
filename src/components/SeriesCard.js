import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Row, Col, Divider } from 'antd';

export const SeriesCard = (props) => {
    const [redirect, setRedirect] = useState(false)

    const handleClick = () => {
        setRedirect(true)
    }

    const jerseySet = [
        {
            team1Jersey: 'White',
            team2Jersey: 'Dark',
        },
        {
            team1Jersey: 'White',
            team2Jersey: 'Dark',
        },
        {
            team1Jersey: 'Dark',
            team2Jersey: 'White',
        },
        {
            team1Jersey: 'Dark',
            team2Jersey: 'White',
        },
        {
            team1Jersey: 'White',
            team2Jersey: 'Dark',
        },
        {
            team1Jersey: 'Dark',
            team2Jersey: 'White',
        },
        {
            team1Jersey: 'White',
            team2Jersey: 'Dark',
        },
    ]

    let gameNumber = 0
    if (props.seriesGames && props.seriesGames.length) {
        gameNumber = Math.min(props.seriesGames.length, 6)
    }

    return (
        <>
            {redirect && <Redirect push to={`/teams/${props.seriesId}`} />}
            {props.divider && <Divider />}
            <div onClick={props.disableRedirect ? undefined : handleClick} style={{ cursor: !props.disableRedirect && 'pointer' }}>
                <Row gutter={24} style={{ display: 'inherit' }}>
                    <Col >
                        <h2>{props.title}</h2>
                    </Col>
                </Row>
                <Row gutter={24}>
                    <Col span={10}>
                        <h2>{props.team1Name}</h2>
                    </Col>
                    <Col span={4}>
                        <h3 style={{ margin: "7px" }}>VS</h3>
                    </Col>
                    <Col span={10}>
                        <h2>{props.team2Name}</h2>
                    </Col>
                </Row>
                {props.seriesGames &&
                    <Row gutter={24}>
                        <Col span={10}>
                            <p>Jersey Colour: {jerseySet[gameNumber].team1Jersey}</p>
                        </Col>
                        <Col span={4}>
                        </Col>
                        <Col span={10}>
                            <p>Jersey Colour: {jerseySet[gameNumber].team2Jersey}</p>
                        </Col>
                    </Row>
                }
                {props.captain &&
                    <Row gutter={24}>
                        <Col span={10}>
                            <p>Captain: {props.captain1}</p>
                        </Col>
                        <Col span={4}>
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
            </div>
            {props.SeriesCarousel && <props.SeriesCarousel seriesGames={props.seriesGames} team1Name={props.team1Name} team2Name={props.team2Name} />}

        </>
    )
}