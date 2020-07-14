import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroller';
import { List, Spin } from 'antd';

export const PrevSummary = (props) => {
  const [gameIds, setGameIds] = useState([props.allGames.length, Math.min(props.allGames.length + 20, props.allGames[0].id)])
  const [isLoading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const data = props.allGames.map((gameData, i) => {
    return {
      id: gameData.id,
      title: `${gameData.game_result[0].team_name} vs ${gameData.game_result[1].team_name} - Game ${gameData.num}`
    }
  })

  const loadMore = async () => {
    setLoading(true)
    if (gameIds[0] + 1 > props.allGames[0].id) {
      setHasMore(false)
      setLoading(false)
      return
    }
    const newGames = await (await (fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/game/?game_ids=${gameIds[0]},${gameIds[1]}`))).json()
    props.setAllGames(allGames => [...allGames, ...newGames])
    setGameIds([gameIds[1], Math.min(gameIds[1] + (gameIds[1] - gameIds[0]), props.allGames[0].id)])
    setLoading(false)
  }

  return (
    <InfiniteScroll
      initialLoad={false}
      loadMore={loadMore}
      hasMore={!isLoading && hasMore}
      useWindow={false}
    >
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
      {isLoading &&
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      }
    </InfiniteScroll>
  )
}
