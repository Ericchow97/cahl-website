import React from 'react';
import { Table } from 'antd';

const { Column } = Table;

export const GameSummaryTable = (props) => {
  return (
    <>
          <Table 
            dataSource={props.data}
            pagination={false}
            style={{overflowX:'auto', paddingBottom: '24px'}}
          >
                <Column title="Player" dataIndex="player" key="player" sorter={(a, b) => a.player - b.player} sortDirections={['descend', 'ascend']}/>
                <Column title="G" dataIndex="goals" key="goals" sorter={(a, b) => a.goals - b.goals} sortDirections={['descend', 'ascend']}/>
                <Column title="A" dataIndex="assists" key="assists" sorter={(a, b) => a.assists - b.assists} sortDirections={['descend', 'ascend']}/>
                <Column title="Pts" dataIndex="points" key="points" sorter={(a, b) => a.points - b.points} sortDirections={['descend', 'ascend']}/>
                <Column title="GA" dataIndex="ga" key="ga" sorter={(a, b) => a.gaa - b.gaa} sortDirections={['descend', 'ascend']}/>
          </Table>
    </>
  )
}