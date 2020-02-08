import React from 'react';
import { CardTemplate } from '../CardTemplate'
import { PlayersTable } from './PlayersTable'

export const AllPlayers = (props) => {
    const allPlayers = [
        {
          key: "1",
          id: "99",
          player: "Eric Chow",
          position: "Center",
          birthDate: "date",
          homeTown: "Markham"
        },
        {
            key: "2",
            id: "3",
            player: "Ewefric Chow",
            position: "Goalie",
            birthDate: "date",
            homeTown: "Toronto"
          },
    ]
    return (
        <>
            <CardTemplate header="All Players">
                <PlayersTable data={allPlayers} handleClick={props.handleClick}/>
            </CardTemplate>
        
        </>
    )
}