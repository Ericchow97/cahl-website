import React from 'react';
import { CardTemplate } from '../CardTemplate'
import { SeriesCard } from '../SeriesCard'

export const CAHLTeams = (props) => {

    //TODO: Click on team series card will show the players and the amount of points they had in that series
    let previousSeries = [] 
    // Todo: Test if this works
    // all series added to previous series
    if (props.allSeries.length > 1) {
        for (let i = 1; i < props.allSeries.length; i++) {
            const team1 = props.allSeries[i].teams[0]
            const team2 = props.allSeries[i].teams[1]

            previousSeries.push(<SeriesCard 
                key={i}
                title={`Series #${props.allSeries[i].id}`}
                team1Name={team1.name}
                team2Name={team2.name}
                team1Score={team1.series_score}
                team2Score={team2.series_score}
                captain="true"
                captain1={team1.captain}
                captain2={team2.captain}
                divider={true}
                seriesId={props.allSeries[i].id}
            />)
        }
        
    }

    return (
        <>
            <CardTemplate loading={props.isLoading} header='Current Series'>
                    <SeriesCard 
                        title={`Series #${props.allSeries[0].id}`}
                        team1Name={props.allSeries[0].teams[0].name}
                        team2Name={props.allSeries[0].teams[1].name}
                        team1Score={props.allSeries[0].teams[0].series_score}
                        team2Score={props.allSeries[0].teams[1].series_score}
                        captain="true"
                        captain1={props.allSeries[0].teams[0].captain}
                        captain2={props.allSeries[0].teams[1].captain}
                        seriesId={props.allSeries[0].id}
                    />
                </CardTemplate>
                {previousSeries.length > 0 &&
                <CardTemplate loading={props.isLoading} header='Previous Series'>
                    {previousSeries}
                </CardTemplate>
                }
        </>   
    )    
}