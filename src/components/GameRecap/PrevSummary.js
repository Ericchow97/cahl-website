import React from 'react'
import { List } from 'antd';

export const PrevSummary = (props) => {
  const data = props.allGames.map((gameData, i) => {
    return {
      id: gameData.id,
      title: `${gameData.game_result[0].team_name} vs ${gameData.game_result[1].team_name} - Game ${gameData.num}`
    }
  })
  //TODO: Display with pagination
  return (
    <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={item => (
          <List.Item onClick={() => props.handleClick(item.id)}>
              <List.Item.Meta
              title={item.title}
              />
          </List.Item>
        )}
    />
  )
}
