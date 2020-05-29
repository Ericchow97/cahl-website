import React, { useState } from 'react'
import { Redirect } from 'react-router';
import { Button, Row, Col, Select} from 'antd';

const { Option } = Select

export const AdminPageInstance = (props) => {
  const [ redirectTo, setRedirectTo ] = useState()
  const [ gameInstance, setGameInstance ] = useState()
  const [ seriesInstance, setSeriesInstance ] = useState()

  const handleClick = (e) => {
    setRedirectTo(e.target.innerText)
  }

  const handleOptionSelect = (type, val) => {
    // find the index for the specific game or series
    if (type === 'Edit Game') {
      const gameIndex = props.allGames.findIndex(game => `${game.game_result[0].team_name} vs. ${game.game_result[1].team_name} Game #${game.num}` === val)
      setGameInstance(props.allGames[gameIndex].id)
    } else if (type === 'Edit Series') {
      const seriesIndex = props.allSeries.findIndex(series => `Series #${series.id} ${series.teams[0].name} vs. ${series.teams[1].name}` === val)
      setSeriesInstance(props.allSeries[seriesIndex].id)
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

  return (
    <>
      {redirectTo === 'Create New Game' && <Redirect push to = '/admin/newGame'/>}
      {redirectTo === 'Create New Series' && <Redirect push to = '/admin/createSeries'/>}
      {redirectTo === 'Logout' && <Redirect push to = '/logout'/>}
      {redirectTo === 'Edit Game' && <Redirect push to = {`/gameRecap/${gameInstance}/admin/editGame`}/>}
      {redirectTo === 'Edit Series' && <Redirect push to = {`/teams/${seriesInstance}/admin/editTeams`}/>}
      <Row gutter={[0, 16]}>
        <Col xs={6}>
          <h3>Create</h3>
        </Col>
        <Col xs={9}  style={{textAlign: 'right'}}>
          <Button type="primary" onClick={handleClick}>Create New Game</Button>
        </Col>
        <Col xs={9}  style={{textAlign: 'right'}}>
          <Button type="primary" onClick={handleClick}>Create New Series</Button>

        </Col>
      </Row>
      <h3>Edit</h3>
      <Row gutter={[0, 32]}>
        <Col xs={18}>
          <Select
            showSearch
            onInputKeyDown={e => handleSelect(e)}
            style={{ color: 'black', padding: '0', width: '100%'}}
            placeholder="Game Instance"
            onSelect={(val) => handleOptionSelect('Edit Game', val)}
          >
            {props.allGames.map(game => (
              <Option 
                key={game.id} 
                style={{ color: 'black' }}
                value={`${game.game_result[0].team_name} vs. ${game.game_result[1].team_name} Game #${game.num}`}
              >{`${game.game_result[0].team_name} vs. ${game.game_result[1].team_name} Game #${game.num}`}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={6} style={{textAlign: 'right'}}>
          <Button type="primary" onClick={handleClick}>Edit Game</Button>
        </Col>
      </Row>
      <Row gutter={[0, 32]}>
        <Col xs={18}>
          <Select
            showSearch
            onInputKeyDown={e => handleSelect(e)}
            style={{ color: 'black', padding: '0', width: '100%'}}
            placeholder="Series Instance"
            onSelect={(val) => handleOptionSelect('Edit Series', val)}
          >
            {props.allSeries.map(series => (
              <Option 
                key={series.id} 
                style={{ color: 'black' }}
                value={`Series #${series.id} ${series.teams[0].name} vs. ${series.teams[1].name}`}
              >{`Series #${series.id} ${series.teams[0].name} vs. ${series.teams[1].name}`}</Option>
            ))}
          </Select>
        </Col>
        <Col xs={6} style={{textAlign: 'right'}}>
          <Button type="primary" onClick={handleClick}>Edit Series</Button>
        </Col>
      </Row>
      <Row gutter={[0, 16]}>
        <Col xs={6}>
          <h3>Logout</h3>
        </Col>
        <Col xs={18} style={{textAlign: 'right'}}>
          <Button type="primary" onClick={handleClick}>Logout</Button>
        </Col>
      </Row>
    </>
  )
}