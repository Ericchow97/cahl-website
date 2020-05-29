import React, { useState, useEffect } from 'react'
import { StatsTable } from './StatsTable'

export const AllTimeStats = (props) => {
  const [ allPlayersStats, setAllPlayersStats ] = useState([])

  useEffect(() => {
    const playersStats = props.players.map((currPlayer, i) => {
      const playerStats = {
        'games': 0, 
        'goals': 0, 
        'assists': 0, 
        'points': 0, 
        'wins': 0,
        'loss': 0
      };
      let goalieGames = 0
      let ga = 0
      currPlayer.stats.forEach(stats => {
        playerStats['games'] += 1;
        playerStats['goals'] += stats.goals;
        playerStats['assists'] += stats.assists;
        playerStats['points'] += stats.points;
        if (stats.is_goalie) {
          goalieGames += 1;
          if (stats.win) {
            playerStats['wins'] += 1
          } else {
            playerStats['loss'] += 1
          }
          ga += stats.ga;
        }
      })
      if (goalieGames > 0) {
        playerStats.gaa = Math.round((ga/goalieGames + Number.EPSILON) * 100) / 100
      } else {
        playerStats.gaa = 0
      }
      const playerInfo = {
        'key': i,
        'id':currPlayer.id,
        'num': currPlayer.num,
        'player': currPlayer.name
      }
      if (playerInfo.player === 'Eric Chow') {
        playerInfo.num = String.fromCharCode(960)
      }
      const player = Object.assign({}, playerInfo, playerStats)
      return player
    })
    setAllPlayersStats(playersStats)
  }, [props.isLoading])

  return (
    <StatsTable data={allPlayersStats} handleClick={props.handleClick} />
  )
}