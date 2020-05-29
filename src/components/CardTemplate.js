import React from 'react';
import { Card, Button } from 'antd';

export const CardTemplate = (props) => {
    return (
        <Card 
            title={props.header}
            headStyle={{
                backgroundImage: "linear-gradient(to right, rgb(30,30,30) , red)", 
                fontSize: (!props.headSize && "24px"), 
                textAlign: (props.headerAlign && "center")
            }}
            bodyStyle={{backgroundColor: "black"}}
            loading={props.loading}
            bordered={false}
            style={{
                border: "2px solid rgb(138, 15, 15)",
                margin: "24px 0"
            }}
            className="card-border"
            extra={props.extra && <Button type="primary" onClick={props.handleClick}>{props.buttonText}</Button>}
        >
            <div style={props.style}>{props.children}</div>
        </Card>
    )
}