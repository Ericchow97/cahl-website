import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet'
import { SeriesStats } from './components/PlayersStats/SeriesStats';
import { AllTimeStats } from './components/PlayersStats/AllTimeStats';
import { SortingStats } from './components/SortingStats';
import { CardTemplate } from './components/CardTemplate'

export const PlayersStats = (props) => {
  const [redirect, changeRedirect] = useState(false)
  const [playerId, changeId] = useState(null)

  const handleClick = (record) => {
    changeRedirect(true)
    changeId(record.id)
  }

  return (
    <>
      <Helmet>
        <title>Player Stats</title>
      </Helmet>
      {redirect && <Redirect push to={"/players/" + playerId} />}
      <SortingStats tab1="Series Stats" tab2="All Time Stats">
        <CardTemplate loading={props.homeLoading} header="Current Series Stats">
          <SeriesStats
            currentSeries={props.currentSeries}
            currentSeriesStats={props.currentSeriesStats}
            handleClick={handleClick}
          />
        </CardTemplate>
        <CardTemplate loading={props.statsLoading} header="All Time Stats">
          <AllTimeStats
            allPlayersStats={props.allPlayersStats}
            handleClick={handleClick}
          />
        </CardTemplate>
      </SortingStats>
    </>
  )
}
