import React from 'react';
import { Card, Button } from 'antd';
import { ThreeStars } from '../GameRecap/ThreeStars'

const { Meta } = Card;

export const GameRecapSummary = (props) => {
    return (
        <>
            {props.recentGame && props.recentGame.game_summary ? (
                <>
                    <Meta
                        title={props.recentGame.game_summary.title}
                        description={<pre>{props.recentGame.game_summary.summary}</pre>}
                        style={{ color: "white" }}
                    />
                    <ThreeStars stars={props.recentGame.game_summary} />
                </>
            ) : (
                    <h1>Game Summary has not been created yet</h1>
                )
            }
            <div style={{ textAlign: 'right' }}>
                <Button type="primary" name='gameSummary' onClick={(record) => props.handleClick(record)}>Read More</Button>
            </div>
        </>
    )
}