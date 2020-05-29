import React from 'react';
import { Table } from 'antd';

const { Column } = Table;

export const StatsTable = (props) => {
  return (
    <>
      <Table 
        dataSource={props.data}
        pagination={false}
        style={{overflowX:'auto', paddingBottom: '24px'}}
        onRow={(record) => {
          return {
              onClick: () => props.handleClick(record)
          }
        }}
      >
        <Column title="#" dataIndex="num" key="num" sorter={(a, b) => a.num - b.num} sortDirections={['descend', 'ascend']}/>
        <Column title="Player" dataIndex="player" key="player" sorter={(a, b) => {if (a.player < b.player) return -1; else if(a.player > b.player) return 1; else return 0}} sortDirections={['descend', 'ascend']}/>
        <Column title="GP" dataIndex="games" key="games" sorter={(a, b) => a.games - b.games} sortDirections={['descend', 'ascend']}/>
        <Column title="G" dataIndex="goals" key="goals" sorter={(a, b) => a.goals - b.goals} sortDirections={['descend', 'ascend']}/>
        <Column title="A" dataIndex="assists" key="assists" sorter={(a, b) => a.assists - b.assists} sortDirections={['descend', 'ascend']}/>
        <Column title="Pts" dataIndex="points" key="points" sorter={(a, b) => a.points - b.points} sortDirections={['descend', 'ascend']}/>
        <Column title="W" dataIndex="wins" key="wins" sorter={(a, b) => a.wins - b.wins} sortDirections={['descend', 'ascend']}/>
        <Column title="L" dataIndex="loss" key="loss" sorter={(a, b) => a.loss - b.loss} sortDirections={['descend', 'ascend']}/>
        <Column title="GAA" dataIndex="gaa" key="gaa" sorter={(a, b) => a.gaa - b.gaa} sortDirections={['descend', 'ascend']}/>
      </Table>
    </>
  )
}