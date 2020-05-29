import React, {useState} from 'react';
import { Table } from 'antd';

const { Column } = Table;

export const ScoringLeaders = (props) => {
    const [playerImage, setImage] = useState(props.topScorers[0].image)

    const data = props.topScorers.map((player, i) => {
        return {
            key: i,
            id: player.id,
            num: player.num,
            name: player.name,
            goals: player.goals,
            assists: player.assists,
            points: player.points,
            image: player.image
        }
    })

    const handleMouseOver = (record) => {
        console.log(record)
        setImage(record.image)
    }

    return (
        <>
            {/*TODO: change float*/}
            <div className="float" style={{width:"60%"}}>
                <Table 
                    dataSource={data}
                    pagination={false}
                    onRow={(record) => {
                        return {
                            onMouseEnter: () => handleMouseOver(record),
                            onClick: () => props.handleClick(record)
                        }
                    }}
                >
                    <Column title="#" dataIndex="num" key="num" />
                    <Column title="Name" dataIndex="name" key="name" />
                    <Column title="G" dataIndex="goals" key="goals" />
                    <Column title="A" dataIndex="assists" key="assists" />
                    <Column title="Pts" dataIndex="points" key="points" />
                </Table>
            </div>
            {/*TODO: change this to be mobile friendly and remove the class*/}
            <div className ="center-float float" style={{width:"30%"}}>
                <img src={playerImage} alt="player" width="100%"/>
            </div>  
        </>          
    )
}

