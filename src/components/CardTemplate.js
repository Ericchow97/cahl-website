import React, { useState } from 'react';
import { Card } from 'antd';

export const CardTemplate = (props) => {
    const [loading, loaded] = useState(false)

    // const loaded = ()=> {
    //     loaded(false)
    // }
    return (
        <Card 
            title={props.header}
            headStyle={{
                backgroundImage: "linear-gradient(to right, rgb(30,30,30) , red)", 
                fontSize: (!props.headSize && "24px"), 
                textAlign: (props.headerAlign && "center")
            }}
            bodyStyle={{backgroundColor: "black"}}
            loading={loading}
            bordered={false}
            style={{
                border: "2px solid rgb(138, 15, 15)",
                margin: "24px 0"
            }}
            className="card-border"
        >
            <div style={props.style}>{props.children}</div>
        </Card>
    )
}