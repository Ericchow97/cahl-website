import React, {useState} from 'react';
import { Table } from 'antd';
import { CardTemplate } from '../CardTemplate'

const { Column } = Table;

export const ScoringLeaders = (props) => {
    const data = [
        {
          key: '1',
          id: '1',
          name: 'name',
          goals: 20,
          assists: 99,
          points: 119,
          image:"ericchow.gif"
        },
        {
          key: '2',
          id: '2',
          name: 'name 2',
          goals: 20,
          assists: 10,
          points: 30,
          image: "Alex.jpg"
        },
        {
          key: '3',
          id: '3',
          name: 'name 3',
          goals: 10,
          assists: 20,
          points: 30,
          image: "chrischow.jpg"
        },
        {
          key: '4',
          id: '4',
          name: 'name 4',
          goals: 5,
          assists: 20,
          points: 25,
          image: "Clarence.gif"
        },
        {
          key: '5',
          id: '5',
          name: 'name 5',
          goals: 0,
          assists: 1,
          points: 1,
          image: "Ken.gif"
        }
    ]

    const images = data.map(person => {
        return require('../../assets/' + person.image)
    })

    const [playerImage, setImage] = useState(images[0])
    const handleMouseOver = (record, rowIndex) => {
        setImage(images[rowIndex])
        console.log("test")
    }

    return (
        <CardTemplate header="Scoring Leaders">
            <div className="float" style={{width:"60%"}}>
                <Table 
                    dataSource={data}
                    pagination={false}
                    onRow={(record, rowIndex) => {
                        return {
                            onMouseEnter: () => handleMouseOver(record, rowIndex),
                            onClick: () => props.handleClick(record)
                        }
                    }}
                >
                    <Column title="#" dataIndex="id" key="id" />
                    <Column title="Name" dataIndex="name" key="name" />
                    <Column title="G" dataIndex="goals" key="goals" />
                    <Column title="A" dataIndex="assists" key="assists" />
                    <Column title="Pts" dataIndex="points" key="points" />
                </Table>
            </div>
            <div className ="center-float float" style={{width:"30%"}}>
                <img src={playerImage} alt="player" width="100%"/>
            </div>            
        </CardTemplate>
    )
}

