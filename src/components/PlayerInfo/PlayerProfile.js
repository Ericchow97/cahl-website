import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'
import { Divider } from 'antd';
import { PlayerStatsTable } from './PlayerStatsTable';

export const PlayerProfile = (props) => {

  const [ playerStats, setPlayerStats ] = useState([])

  // want to find the index of the player who was selected
  const playerIndex = props.players.findIndex(player => player.id === parseInt(props.playerId))
  const playerData = props.players[playerIndex]

  useEffect(() => {
    const careerStats = [
      {
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
    ]
    //index into the player and grab the players Stats and add it to career stats
    let currentSeriesTeamName = props.players[playerIndex].stats[0].team_name
    let uniqueKey = 0
    let currentSeriesStats = {
      key: uniqueKey++,
      team: currentSeriesTeamName,
      games: 0,
      goals: 0,
      assists: 0,
      points: 0,
      wins: 0,
      loss: 0,
      ga: 0
    }

    props.players[playerIndex].stats.forEach(game => {
      // add the stats to the career stats
      careerStats[0].games += 1
      careerStats[0].goals += game.goals
      careerStats[0].assists += game.assists
      careerStats[0].points += game.points
      // if they are goalie handle the goalie cases
      if (game.is_goalie) {
        // if the player won, add a win as a goalie
        if (game.win) {
          careerStats[0].wins += 1
        } 
        // else add a loss for the goalie
        else {
          careerStats[0].loss += 1
        }
        careerStats[0].ga += game.ga
      }
      //compare if the team name is the same as the one in the variable name
      // if names are not the same, replace the currentSeriesTeamName and make a new instance of currentSeriesStats
      if (currentSeriesTeamName !== game.team_name) {
        currentSeriesTeamName = game.team_name
        //calculate GAA for the goalie and add to career stats
        if (currentSeriesStats.wins || currentSeriesStats.loss) {
          currentSeriesStats.gaa = currentSeriesStats.ga / (currentSeriesStats.wins + currentSeriesStats.loss)
        } else {
          currentSeriesStats.gaa = 0
        }
        //push the current series stats into the career stats
        careerStats[0].children.push(currentSeriesStats)
        //make new instance of currentSeriesStats
        currentSeriesStats = {
          key: uniqueKey++,
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
      // add the current game stats into currentSeriesStats
      currentSeriesStats.games += 1
      currentSeriesStats.goals += game.goals
      currentSeriesStats.assists += game.assists
      currentSeriesStats.points += game.points
      if (game.is_goalie) {
        // if the player won, add a win as a goalie
        if (game.win) {
          currentSeriesStats.wins += 1
        } 
        // else add a loss for the goalie
        else {
          currentSeriesStats.loss += 1
        }
        currentSeriesStats.ga += game.ga
      }
    })
    // when finished, need to push in the last instance
    //calculate GAA for the goalie and add to career stats
    if (currentSeriesStats.wins || currentSeriesStats.loss) {
      currentSeriesStats.gaa = currentSeriesStats.ga / (currentSeriesStats.wins + currentSeriesStats.loss)
    } else {
      currentSeriesStats.gaa = 0
    }
    //push the current series stats into the career stats
    careerStats[0].children.push(currentSeriesStats)
    //calculate GAA for the goalie and add to career stats
    if (careerStats[0].wins || careerStats[0].loss) {
      careerStats[0].gaa = careerStats[0].ga / (careerStats[0].wins + careerStats[0].loss)
    } else {
      careerStats[0].gaa = 0
    }
    
    setPlayerStats(careerStats)

  }, [])
  //TODO: change the player image size to match screen resolution
  return (
    <>
      <Helmet>
        <title>{`${playerData.name}`}</title>
      </Helmet>
      <img src='https://nhl.bamcontent.com/images/arena/default/10.jpg' alt="background" width='100%'/>
      <img src={playerData.image} alt="player" className='circle-img'/>
      <div className="player-info">
        {playerData.name}
        <Divider type="vertical" />
        {playerData.num}
      </div>
      <PlayerStatsTable data={playerStats}/>
    </>
  )
} 
