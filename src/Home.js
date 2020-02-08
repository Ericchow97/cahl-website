import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Row, Col } from 'antd';
import { ScoringLeaders } from './components/Home/ScoringLeaders';
import { SeriesHome } from "./components/Home/SeriesHome";
import { GameRecapSummary } from "./components/Home/GameRecapSummary";


export const Home = () => {
    // require call to API for scoring leaders and recap of game
    // JSX to hover over player name to show picture?
    const [ redirect,  changeRedirect ] = useState(false)
    const [ playerId, changeId ] = useState(null)
    
    const handleClick = (record) => {
        changeRedirect(true)
        changeId(record.id)
    }

    return (
        <>
            {redirect && <Redirect push to={"/players/" + playerId} />}
            <Row gutter={24}>
                <Col lg={12}>
                    <SeriesHome />
                </Col>
                <Col lg={12}>
                    <ScoringLeaders handleClick={handleClick} />
                </Col>
            </Row>      
            <GameRecapSummary />
        </>
    )
}
