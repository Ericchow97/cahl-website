import React from 'react';
import { SeriesCarousel } from './SeriesCarousel'
import { SeriesCard } from '../SeriesCard'

export const SeriesHome = (props) => {
    console.log(props.activeSeries.games)
    return (
        <SeriesCard
            title={`Series # ${props.activeSeries.id}`}
            team1Name={props.activeSeries.teams[0].name}
            team2Name={props.activeSeries.teams[1].name}
            team1Score={props.activeSeries.teams[0].series_score}
            team2Score={props.activeSeries.teams[1].series_score}
            SeriesCarousel={SeriesCarousel}
            seriesGames={props.activeSeries.games}
            seriesId={props.activeSeries.id}
        />
    )    
}