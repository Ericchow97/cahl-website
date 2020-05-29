import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet'
import { SeriesStats } from './components/PlayersStats/SeriesStats';
import { AllTimeStats } from './components/PlayersStats/AllTimeStats';
import { SortingStats } from './components/SortingStats';
import { CardTemplate } from './components/CardTemplate'

export const PlayersStats = (props) => {
  const [ redirect,  changeRedirect ] = useState(false)
  const [ playerId, changeId ] = useState(null)
  
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
          <CardTemplate loading={props.isLoading} header="Current Series Stats">
            <SeriesStats 
              activePlayersStats={props.activePlayersStats}
              activeSeries={props.activeSeries}
              handleClick={handleClick}
            />
          </CardTemplate>
          <CardTemplate loading={props.isLoading} header="All Time Stats">
            <AllTimeStats
              players={props.players} 
              isLoading={props.isLoading}
              handleClick={handleClick}
            />
          </CardTemplate>
        </SortingStats>
      </>
  )
}
