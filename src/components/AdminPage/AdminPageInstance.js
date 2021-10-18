import React, { useState, useContext } from 'react'
import { Redirect } from 'react-router';
import { Button, Row, Col, Select, Spin, InputNumber, message } from 'antd';
import { fetchRequest, createWalkOn } from '../Admin/CommonFunctions'
import { AdminContext } from '../../AdminContextProvider'


export const AdminPageInstance = (props) => {
  const [redirectTo, setRedirectTo] = useState()
  const [gameInstance, setGameInstance] = useState()
  const [seriesInstance, setSeriesInstance] = useState()
  const [players, setPlayers] = useState(0)
  const [goalies, setGoalies] = useState(0)
  const adminContext = useContext(AdminContext)

  const [gameIds, setGameIds] = useState([props.allGames.length, Math.min(props.allGames.length + 20, props.allGames[0].id)])
  const [isLoading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const handleClick = (e) => {
    setRedirectTo(e.target.innerText)
  }

  const handleSubmit = async () => {
    const data = {
      id: 1,
      date: new Date().toISOString(),
      players: players,
      goalies: goalies
    }
    const ret = await fetchRequest(createWalkOn, adminContext, 'create', { data: data })
    console.log(ret)
    if (!ret.success) {
      return ret
    }
    message.success('Successfully updated')
    return { success: true }
  }

  const handleOptionSelect = (type, id) => {
    // find the index for the specific game or series
    if (type === 'Edit Game') {
      setGameInstance(id)
    } else if (type === 'Edit Series') {
      setSeriesInstance(id)
    }
  }

  // function for selecting item when highlighted using tab or enter
  const handleSelect = e => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      let list_element = e.target.id + '_list'
      let element_select = document.querySelector(`#${list_element} ~ div > div > div > .ant-select-item-option-active`)
      if (element_select) {
        element_select.click()
      }
    }
  }

  const loadMore = async (e) => {
    const { target } = e

    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
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
  }

  const gameOptions = props.allGames.map(game => (
    {
      label: `${game.game_result[0].team_name} vs. ${game.game_result[1].team_name} Game #${game.num}`,
      value: game.id
    }
  ))

  const teamOptions = props.allSeries.map(series => (
    {
      label: `Series #${series.id} ${series.teams[0].name} vs. ${series.teams[1].name}`,
      value: series.id
    }
  ))

  return (
    <>
      {redirectTo === 'Create New Game' && <Redirect push to='/admin/newGame' />}
      {redirectTo === 'Create New Series' && <Redirect push to='/admin/createSeries' />}
      {redirectTo === 'Logout' && <Redirect push to='/logout' />}
      {redirectTo === 'Edit Game' && <Redirect push to={`/gameRecap/${gameInstance}/admin/editGame`} />}
      {redirectTo === 'Edit Series' && <Redirect push to={`/teams/${seriesInstance}/admin/editTeams`} />}
      <Row gutter={[0, 16]}>
        <Col xs={6}>
          <h3>Create</h3>
        </Col>
        <Col xs={9} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleClick}>Create New Game</Button>
        </Col>
        <Col xs={9} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleClick}>Create New Series</Button>

        </Col>
      </Row>
      <h3>Edit</h3>
      <Row gutter={[0, 32]}>
        <Col xs={18}>
          <Select
            showSearch
            onInputKeyDown={e => handleSelect(e)}
            style={{ color: 'black', padding: '0', width: '100%' }}
            placeholder="Game Instance"
            onSelect={(id) => handleOptionSelect('Edit Game', id)}
            onPopupScroll={hasMore && (e => loadMore(e))}
            options={gameOptions}
            dropdownRender={menu => (
              <>
                {menu}
                {isLoading &&
                  <div style={{ textAlign: 'center' }}>
                    <Spin />
                  </div>
                }
              </>
            )}
          />
        </Col>
        <Col xs={6} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleClick}>Edit Game</Button>
        </Col>
      </Row>
      <Row gutter={[0, 32]}>
        <Col xs={18}>
          <Select
            showSearch
            onInputKeyDown={e => handleSelect(e)}
            style={{ color: 'black', padding: '0', width: '100%' }}
            placeholder="Series Instance"
            onSelect={(id) => handleOptionSelect('Edit Series', id)}
            options={teamOptions}
          />
        </Col>
        <Col xs={6} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleClick}>Edit Series</Button>
        </Col>
      </Row>
      <Row gutter={[0, 16]}>
        <Col xs={6}>
          <h3>Walk-ons</h3>
        </Col>
        <Col xs={6}>
          <p>Players</p>
          <InputNumber onChange={e => setPlayers(e)} />
        </Col>
        <Col xs={6}>
          <p>Goalies</p>
          <InputNumber onChange={e => setGoalies(e)} />
        </Col>
        <Col xs={6} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleSubmit}>Submit</Button>
        </Col>
      </Row>
      <Row gutter={[0, 16]}>
        <Col xs={6}>
          <h3>Logout</h3>
        </Col>
        <Col xs={18} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={handleClick}>Logout</Button>
        </Col>
      </Row>
    </>
  )
}