import React from 'react';
import { SeriesCarousel } from './SeriesCarousel'
import { SeriesCard } from '../SeriesCard'

export const SeriesHome = (props) => {
    return (
        <SeriesCard
            title={`Series # ${props.currentSeries.id}`}
            team1Name={props.currentSeries.teams[0].name}
            team2Name={props.currentSeries.teams[1].name}
            team1Score={props.currentSeries.teams[0].series_score}
            team2Score={props.currentSeries.teams[1].series_score}
            SeriesCarousel={SeriesCarousel}
            seriesGames={props.currentSeries.games}
            seriesId={props.currentSeries.id}
        />
    )    
}