import React from 'react';
import { CardTemplate } from '../CardTemplate'
import { PlayersTable } from './PlayersTable'

export const ActivePlayers = (props) => {
    const activePlayers = [
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
            <CardTemplate header="Active Players">
                <PlayersTable data={activePlayers} handleClick={props.handleClick}/>
            </CardTemplate>
        
        </>
    )
}