import React from 'react';
import { Card, Button } from 'antd';
import { CardTemplate } from '../CardTemplate'

const { Meta } = Card;

export const GameRecapSummary = () => {
    return (
        <CardTemplate header="Game Recap">
            <Meta 
                title="Title"
                description="Happy New Year!!! We rang in the Year of the Rat with a beauty of a game. It took 10 shooters from each side in the shoot out to decide game 4. In the end, General Herman and his Storm Troopers prevailed. Andrew Hwee scored on his second attempt (Yup, we went all the way around) to get his team the victory.The 6-5 shoot out victory moved General Herman 1 victory away from his first CAHL series win. Chief Louis will need to inspire himself and his team to come back from a 1- 3 series deficit. It has been done before; he has enough fire power. They just need to figure out Herman to get more pucks behind him."
                style={{color:"white"}}
            />
            <Button type="danger" href="/gameRecap">Read More</Button>
        </CardTemplate>
    )
}