import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'
import { Divider } from 'antd';
import { PlayerStatsTable } from './PlayerStatsTable';

export const PlayerProfile = (props) => {
  const [playerTotalStats, setPlayerTotalStats] = useState([])
  const playerStats = props.playerStatsData

  useEffect(() => {
    const careerStats = {
      key: '1',
      team: 'CAHL Career',
      games: 0,
      goals: 0,
      assists: 0,
      points: 0,
      wins: 0,
      loss: 0,
      ga: 0,
      children: []
    }
    //set initial variables to use to group information per team
    let seriesId = playerStats[0].series_id
    let currentSeriesTeamName = playerStats[0].team_name
    let uniqueKey = 0
    let currentSeriesStats = {
      key: uniqueKey++,
      series: seriesId,
      team: currentSeriesTeamName,
      games: 0,
      goals: 0,
      assists: 0,
      points: 0,
      wins: 0,
      loss: 0,
      ga: 0
    }

    for (let game = 0; game < playerStats.length; game++) {
      // add the game stats to the career stats
      careerStats.games += 1
      careerStats.goals += playerStats[game].goals
      careerStats.assists += playerStats[game].assists
      careerStats.wins += playerStats[game].win
      careerStats.loss += playerStats[game].is_goalie - playerStats[game].win
      careerStats.ga += playerStats[game].ga

      // add the current game stats into currentSeriesStats
      currentSeriesStats.games += 1
      currentSeriesStats.goals += playerStats[game].goals
      currentSeriesStats.assists += playerStats[game].assists
      currentSeriesStats.wins += playerStats[game].win
      currentSeriesStats.loss += playerStats[game].is_goalie - playerStats[game].win
      currentSeriesStats.ga += playerStats[game].ga

      // if no next game or next team name is not the same, replace the currentSeriesTeamName and make a new instance of currentSeriesStats
      if (!playerStats[game + 1] || (playerStats[game + 1] && currentSeriesTeamName !== playerStats[game + 1].team_name)) {
        if (playerStats[game + 1]) {
          seriesId = playerStats[game + 1].series_id
          currentSeriesTeamName = playerStats[game + 1].team_name
        }
        //calculate GAA for the goalie and add to career stats
        if (currentSeriesStats.wins || currentSeriesStats.loss) {
          currentSeriesStats.gaa = Math.round((currentSeriesStats.ga / (currentSeriesStats.wins + currentSeriesStats.loss) + Number.EPSILON) * 100) / 100
        } else {
          currentSeriesStats.gaa = 0
        }
        currentSeriesStats.points = currentSeriesStats.goals + currentSeriesStats.assists
        careerStats.children.push(currentSeriesStats)
        //make new instance of currentSeriesStats
        currentSeriesStats = {
          key: uniqueKey++,
          series: seriesId,
          team: currentSeriesTeamName,
          games: 0,
          goals: 0,
          assists: 0,
          points: 0,
          wins: 0,
          loss: 0,
          ga: 0
        }
      }
    }
    //calculate GAA for the goalie and add to career stats
    if (careerStats.wins || careerStats.loss) {
      careerStats.gaa = Math.round((careerStats.ga / (careerStats.wins + careerStats.loss) + Number.EPSILON) * 100) / 100
    } else {
      careerStats.gaa = 0
    }
    careerStats.points = careerStats.goals + careerStats.assists
    console.log(careerStats)
    setPlayerTotalStats([careerStats])
  }, [playerStats])
  return (
    <>
      <Helmet>
        <title>{`${props.playerData.name}`}</title>
      </Helmet>
      <img src='https://nhl.bamcontent.com/images/arena/default/10.jpg' alt="background" width='100%' />
      <img src={`http://127.0.0.1:8000/media/${props.playerData.image}`} alt="player" className='circle-img' />
      <div className="player-info">
        {props.playerData.name}
        <Divider type="vertical" />
        {props.playerData.num}
      </div>
      <PlayerStatsTable data={playerTotalStats} />
    </>
  )
} 
