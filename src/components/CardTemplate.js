import React from 'react';
import { Card, Button } from 'antd';
import { Mobile } from '../ResponsiveContextProvider'

export const CardTemplate = (props) => {
    return (
        <Card 
            title={props.header}
            headStyle={{
                backgroundImage: "linear-gradient(to right, rgb(30,30,30) , red)", 
                fontSize: (!props.headSize && "24px"), 
                textAlign: (props.headerAlign && "center")
            }}
            bodyStyle={{backgroundColor: "black", padding: Mobile() && "8px"}}
            loading={props.loading}
            bordered={false}
            style={{
                border: "2px solid rgb(138, 15, 15)",
                margin: Mobile() ? "8px 0" : "24px 0"
            }}
            className="card-border"
            extra={props.extra && <Button type="primary" disabled={props.disabled} onClick={props.handleClick}>{props.buttonText}</Button>}
        >
            <div style={props.style}>{props.children}</div>
        </Card>
    )
}