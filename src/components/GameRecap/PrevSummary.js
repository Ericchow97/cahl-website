import React from 'react'
import { CardTemplate } from '../CardTemplate'
import { List } from 'antd';

export const PrevSummary = () => {
    const data = [
        {
          title: 'Game Recap 1',
        },
        {
          title: 'Game Recap 2',
        },
        {
          title: 'Game Recap 3',
        },
        {
          title: 'Game Recap 4',
        },
    ];
    return (
        <CardTemplate header="Previous Recaps" headSize="20px">
            <List
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                    title={item.title}
                    />
                </List.Item>
                )}
            />
        </CardTemplate>
    )
}
