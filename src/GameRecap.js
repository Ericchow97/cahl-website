import React from 'react';
import { GameSummary } from './components/GameRecap/GameSummary'
import { PrevSummary } from './components/GameRecap/PrevSummary'
import { Row, Col } from 'antd';

export const GameRecap = () => {
    return (
        <>
        <Row gutter={16}>
            <Col span={18}>
                <GameSummary />
            </Col>
            <Col span={6}>
                <PrevSummary />
            </Col>
        </Row>
        </>
    )
}
