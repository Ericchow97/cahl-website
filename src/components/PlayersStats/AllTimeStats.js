import React from 'react'
import { CardTemplate } from '../CardTemplate'
import { StatsTable } from './StatsTable'

export const AllTimeStats = (props) => {
  const allPlayers = [
    {
      key: "1",
      id: "99",
      player: "Eric Chow",
      games: "7",
      goals: "100",
      assists: "10",
      points: "1000",
      wins: "10",
      loss: "0",
      gaa: "2"
    },
    {
      key: "2",
      id: "92",
      player: "arwef Chow",
      games: "7",
      goals: "100",
      assists: "10",
      points: "100",
      wins: "10",
      loss: "0",
      gaa: "2"
    },
    {
      key: "3",
      id: "99",
      player: "Ericewefwef Chow",
      games: "7",
      goals: "99",
      assists: "10",
      points: "100",
      wins: "10",
      loss: "0",
      gaa: "2"
    }
  ];
  return (
    <>
        <CardTemplate header="All Time Stats">
          <StatsTable data={allPlayers} handleClick={props.handleClick} />
        </CardTemplate>
    </>
  )
}