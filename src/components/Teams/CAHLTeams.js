import React from 'react';
import { CardTemplate } from '../CardTemplate'
import { SeriesCard } from '../SeriesCard'

export const CAHLTeams = () => {
    return (
        <>
            <CardTemplate header='Teams of CAHL' style={{textAlign:"center"}}>
                <CardTemplate header='Current Series'>
                    <SeriesCard 
                        title="Series #112"
                        team1="Team Name 1"
                        team2="Team Name 2"
                        team1Score="3"
                        team2Score="2"
                        captain="true"
                        captain1="player 1"
                        captain2="player 2"
                    />
                </CardTemplate>
                <CardTemplate header='Previous Series'>
                    <SeriesCard 
                        title="Series #111"
                        team1="Team Name 1"
                        team2="Team Name 2"
                        team1Score="4"
                        team2Score="2"
                        captain="true"
                        captain1="player 1"
                        captain2="player 2"
                    />
                    <SeriesCard 
                        title="Series #110"
                        team1="Team Name 1"
                        team2="Team Name 2"
                        team1Score="0"
                        team2Score="4"
                        captain="true"
                        captain1="player 1"
                        captain2="player 2"
                        divider="true"
                    />
                    
                </CardTemplate>
            </CardTemplate>
        </>   
    )
}