import React from 'react'
import { Divider, Icon } from 'antd'
import { CardTemplate } from '../CardTemplate'
import { ThreeStars } from './ThreeStars'
import { SeriesCard } from '../SeriesCard'

export const GameSummary = () => {
    const team1 = "Team Name 1"
    const team2 = "Team Name 2"
    const game = "5"
    return (
        <CardTemplate header="Game Recap">
            <h3>Ewoks Dominate Game 5</h3>
            <Divider />
            <div>
                <Icon type="calendar" style={{verticalAlign:"0.125em"}}/>
                <span className="div-pad date-font">February 2, 2020</span>
            </div>
            <CardTemplate header={`${team1} vs ${team2} Game ${game}`} style={{textAlign:"center"}} headerAlign={true}>
                <SeriesCard 
                    team1={team1}
                    team2={team2}
                    team1Score="3"
                    team2Score="2"
                />
            </CardTemplate>
            <ThreeStars />
            <Divider />
            <p>
                Facing elimination, Chief Louis took matters into his own hands and came out firing on all cylinders. He scored 2 goals on his first three shots. He would go on to add two more goals and a helper to lead his team to a crucial game 5 victory.

The Storm Troopers found it challenging to penetrate the Ewoks’ defense. Many of their attacks were turned away by the 4 Ewoks defenders. Larry, Justin, Bill and Jason played a superb game on defense to limit the Storm Troopers scoring chances. It took 45 minutes for the Storm Troopers to score their first goal. Leon Chen sent one home on a good rush and nice pass from Alex Chow.

Andrew Li bolstered a short Ewoks’ bench. The offensive power of the Ewoks in game 5 was just too much for the Storm Troopers. Though General Herman played a good game, they yielded 9 goals.

Final tally was 9 – 3. We head to game 6 next week.

Game Three Stars…..
1) Bill Lai – great game on defense with 2 goals and 1 assist
2) Dave Birch – 2 assists
3) Jason Fiege – Stellar game on defense

Scoring Summary….
1) Ewoks – Louis (Ian, Jason)
2) Ewoks – Louis (Albert)
3) Ewoks – Andrew L. (Bill)
4) Ewoks – Jack (Larry, Andrew L.)
5) Storm Troopers – Leon (Alex, Dave B.)
6) Ewoks – Bill (unassisted)
7) Ewoks – Louis (Albert, Larry)
8) Storm Troopers – Christopher (unassisted)
9) Ewoks – Larry (Ian, Andrew L.)
10) Storm Troopers – Len (Dave B., Tristan)
11) Ewoks – Louis (Jack, Justin)
12) Ewoks – Bill (unassisted
            </p>

            
        </CardTemplate>
    )
}