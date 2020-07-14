import React, { useState } from 'react';
import { Table, Row, Col } from 'antd';
import { Mobile } from '../../ResponsiveContextProvider'

const { Column } = Table;

export const ScoringLeaders = (props) => {
    const [playerImage, setImage] = useState(`https://zappa-uy1que6tl.s3.us-east-2.amazonaws.com/media/${props.topScorers[0].image}`)

    const data = props.topScorers.map((player, i) => {
        return {
            key: i,
            id: player.id,
            num: player.num,
            name: player.name,
            goals: player.goals,
            assists: player.assists,
            points: player.goals + player.assists,
            image: player.image
        }
    })

    const handleMouseOver = (record) => {
        setImage(`https://zappa-uy1que6tl.s3.us-east-2.amazonaws.com/media/${record.image}`)
    }

    return (
        <>
            <Row gutter={12}>
                <Col span={Mobile() ? 24 : 12}>
                    <Table
                        dataSource={data}
                        pagination={false}
                        onRow={(record) => {
                            return {
                                onMouseEnter: () => handleMouseOver(record),
                                onTouchStart: () => handleMouseOver(record),
                                onClick: () => props.handleClick(record)
                            }
                        }}
                    >
                        <Column width='15%' title="#" dataIndex="num" key="num" />
                        <Column width='50%' title="Name" dataIndex="name" key="name" ellipsis={true} />
                        <Column width='10%' title="G" dataIndex="goals" key="goals" />
                        <Column width='10%' title="A" dataIndex="assists" key="assists" />
                        <Column width='15%' title="Pts" dataIndex="points" key="points" />
                    </Table>
                </Col>
                {!Mobile() &&
                    <Col span={12} style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-block', verticalAlign: 'middle', height: '100%' }}></span>
                        <img src={playerImage} alt="player" style={{ verticalAlign: 'middle', maxHeight: '330px', width: '100%', maxWidth: '250px' }} />
                    </Col>
                }
            </Row>
        </>

    )
}

