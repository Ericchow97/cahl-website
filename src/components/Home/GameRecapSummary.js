import React from 'react';
import { Card, Button } from 'antd';
import { ThreeStars } from '../GameRecap/ThreeStars'

const { Meta } = Card;

export const GameRecapSummary = (props) => {
    return (
        <>
            {props.recentStars.length === 3 ? (
                <>
                    <Meta 
                        title={props.recentGame.game_summary.title}
                        description={props.recentGame.game_summary.summary}
                        style={{color:"white"}}
                    />
                    <ThreeStars stars={props.recentStars} />
                </>
            ) : (
                <h1>Game Summary has not been created yet</h1>
            )
            }
            <div style={{textAlign: 'right'}}>
                <Button type="primary" name='gameSummary' onClick={(record) => props.handleClick(record)}>Read More</Button>
            </div>
        </>
    )
}