import React, { useState } from 'react';
import { Card } from 'antd';
import { Mobile } from '../ResponsiveContextProvider'

export const SortingStats = (props) => {
    const tabList = [
        {
            key: 1,
            tab: props.tab1,
        },
        {
            key: 2,
            tab: props.tab2,
        }
    ];

    const contentList = {
        1: props.children[0],
        2: props.children[1]
    };

    const [currentTab, newTab] = useState('1')

    const onTabChange = (key) => {
        newTab(key)
    };

    return (
        <Card
            style={{
                width: '100%',
                border: "2px solid rgb(138, 15, 15)",
                margin: "24px 0"
            }}
            tabList={tabList}
            activeTabKey={currentTab}
            onTabChange={key => onTabChange(key)}
            headStyle={{ backgroundImage: "linear-gradient(to right, rgb(30,30,30) , red)", fontSize: "24px" }}
            bodyStyle={{ backgroundColor: "black", padding: Mobile() && "8px" }}
        >
            {contentList[currentTab]}
        </Card>
    )
}