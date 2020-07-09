import React from 'react'
import { StatsTable } from './StatsTable'

export const AllTimeStats = (props) => {
  const allPlayersStats = props.allPlayersStats.map((player, i) => {
    const playerStats = {
      key: i,
      id: player.id,
      num: player.num,
      player: player.name,
      games: player.games,
      goals: player.goals,
      assists: player.assists,
      points: player.goals + player.assists,
      wins: player.wins,
      loss: player.is_goalie - player.wins,
    }
    if (player.is_goalie > 0) {
      playerStats.gaa = Math.round((player.ga / player.is_goalie + Number.EPSILON) * 100) / 100
    } else {
      playerStats.gaa = 0
    }
    return playerStats
  });

  return (
    <StatsTable data={allPlayersStats} handleClick={props.handleClick} />
  )
}