import React from 'react';
import { CardTemplate } from '../CardTemplate';
import { SeriesCarousel } from './SeriesCarousel'
import { SeriesCard } from '../SeriesCard'

export const SeriesHome = (props) => {
    return (
        <CardTemplate header="Current Series" style={{textAlign:"center"}}>
            <SeriesCard
                title="Series #112"
                team1="Team Name 1"
                team2="Team Name 2"
                team1Score="3"
                team2Score="2"
                SeriesCarousel={SeriesCarousel}
            />
        </CardTemplate>
    )
}