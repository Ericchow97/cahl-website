import React from 'react';
import { CardTemplate } from '../../CardTemplate';
import { Divider } from 'antd';
import { PlayerStatsTable } from './PlayerStatsTable';

export const PlayerInfo = ({match}) => {
    const { params: { playerId } } = match

    const playerStats = [
        {
            key: "1",
            id: "CAHL Career",
            games: "7",
            goals: "100",
            assists: "10",
            points: "1000",
            wins: "10",
            loss: "0",
            gaa: "2",
            children: [
                {
                    id: "Team 1",
                    games: "7",
                    goals: "100",
                    assists: "10",
                    points: "1000",
                    wins: "10",
                    loss: "0",
                    gaa: "2"
                },
                {
                    id: "Team 2",
                    games: "4",
                    goals: "1001",
                    assists: "10",
                    points: "10001",
                    wins: "10",
                    loss: "0",
                    gaa: "2"
                }
            ]
        }
    ]
    return (
        <>
            <CardTemplate header="Player Profile">
                <img src='https://nhl.bamcontent.com/images/arena/default/10.jpg' alt="backrgound" width='100%'/>
                <img src={require('../../../assets/ericchow.gif')} alt="player" className='circle-img'/>
                <div className="divider main-divider">
                    Player Name
                    <Divider type="vertical" />
                    {playerId}
                </div>
                <div className="divider">
                    <span className="div-pad">Center</span>
                    <Divider type="vertical" />
                    <span className="div-pad">6' 1"</span>
                    <Divider type="vertical" />
                    <span className="div-pad">August 3, 1997</span>
                    <Divider type="vertical" />
                    <span className="div-pad">Markham</span>
                    <Divider type="vertical" />
                    <span className="div-pad">Team Name</span>
                </div>
                <PlayerStatsTable data={playerStats}/>
            </CardTemplate>
        </>
        
    )
} 
