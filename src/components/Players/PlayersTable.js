import React from 'react';
import { Table } from 'antd';

const { Column } = Table;

export const PlayersTable = (props) => {
    return (
        <>
            <Table 
                dataSource={props.data}
                pagination={false}
                style={{overflowX:'auto'}}
                onRow={(record) => {
                    return {
                        onClick: () => props.handleClick(record)
                    }
                }}
            >
                    <Column title="#" dataIndex="id" key="id" sorter={(a, b) => a.id - b.id} sortDirections={['descend', 'ascend']}/>
                    <Column title="Name" dataIndex="player" key="player" sorter={(a, b) => a.player - b.player} sortDirections={['descend', 'ascend']}/>
                    <Column title="Position" dataIndex="position" key="position" sorter={(a, b) => a.position - b.position} sortDirections={['descend', 'ascend']}/>
                    <Column title="Birth Date" dataIndex="birthDate" key="birthDate" sorter={(a, b) => a.birthDate - b.birthDate} sortDirections={['descend', 'ascend']}/>
                    <Column title="Home Town" dataIndex="homeTown" key="homeTown" sorter={(a, b) => a.homeTown - b.homeTown} sortDirections={['descend', 'ascend']}/>
            </Table>
        
        </>
    )
}