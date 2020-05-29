import React from 'react'
import { Form, Input, Button, Select, Divider, InputNumber, Checkbox, Row, Col } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

export const TeamAdminView = (props) => {
  // required for layout on team creation
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5},
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: (props.gameStatsView ? 24 : 19) },
    },
  };

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

  // gameStatsView: check if multiple goalies are selected 
  const multipleGoalieCheck = (team) => {
    const players = props.formRef.getFieldValue(team)
    let count = 0
    for (let player of players) {
      if (player && player.isGoalie) {
        count++
      }
      if (count > 1) {
        return false
      }
    }
    return true
  }

  return (
    <>
      {!props.gameStatsView ? (
        <Form.Item
          {...formItemLayout}
          label='Team Name'
          name={`Team${props.teamNum}Name`}
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Please input team name"
            },
            {
              validator(rule, value) {
                if (!props.teamList.includes(value)) {
                  return Promise.resolve();
                }
                return Promise.reject('Team name already exists');
              }
            }
          ]}
        >
          <Input
            style={{maxWidth: '91.6667%'}}
            autoComplete='off'
            placeholder="Team Name"
          />
        </Form.Item>
      ) : (
        <Row gutter={[16, 8]}>
          <Col xs={10} sm={13}>
            Player Name
          </Col>
          <Col xs={4} sm={3} style={{textAlign: 'center'}}>
            Goals
          </Col>
          <Col xs={4} sm={3} style={{textAlign: 'center'}}>
            Assists
          </Col>
          <Col xs={4} sm={3} style={{textAlign: 'center'}}>
            Goalie?
          </Col>
          <Col sm={2}>
          </Col>
        </Row>
      )
      }
      <Form.List name={`Team${props.teamNum}Players`}>
        {(fields, { add, remove }) => {
          return (
            <div>
              {fields.map((field, index) => (
                <Form.Item
                  {...formItemLayout}
                  label={!props.gameStatsView ? index === 0 ? 'Captain' : 'Player': ''}
                  required={false}
                  key={index}
                >
                  <Row gutter={[16, 8]}>
                    <Col xs={10} sm={props.gameStatsView ? 13 : 22}>
                      <Form.Item
                        name={[field.name, 'name']}
                        key={field.key}
                        fieldKey={field.fieldKey}
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            type: 'enum',
                            enum: props.playerList,
                            message: 'Player does not exist, please check spelling or create new player below'
                          },
                          {
                            required: true,
                            whitespace: true,
                            message: "Please input player's name or delete this field.",
                          },
                        ]}
                        noStyle
                      >
                        <Select
                          showSearch
                          onInputKeyDown={e => handleSelect(e)}
                          style={{ color: 'black', padding: '0'}}
                          placeholder="Player Name"
                          dropdownRender={menu => (
                            <div>
                              {menu}
                              <Divider style={{ margin: '4px 0' }} />
                              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }} >
                                <Input style={{ flex: 'auto', marginRight: '10px' }} value={props.playerName} onChange={e => props.onNameChange(e, props.teamNum)} autoComplete='off' />
                                <Button type="primary" onClick={() => props.addNewPlayer(props.teamNum)} style={{ flex: 'none', padding: '0px 8px', display: 'block' }}>
                                  <PlusOutlined style={{ verticalAlign: "0.125em" }} /> Add Player
                                </Button>
                              </div>
                            </div>
                          )}
                        >
                          {props.allPlayers.map(player => (
                            <Option key={player.id} style={{ color: 'black' }} value={player.name}>{player.name}
                              {player.newPlayer && <MinusCircleOutlined
                                style={{ position: 'absolute', right: '5%', bottom: '25%' }}
                                onClick={e => props.removeNewPlayer(e, player.name)}
                              />}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>

                    </Col>
                    {props.gameStatsView && 
                    <>
                      <Col xs={4} sm={3}>
                        <Form.Item
                          name={[field.name, 'goals']}
                          key={`goals${field.key}`}
                          fieldKey={`goals${field.fieldKey}`}
                        >
                          <InputNumber
                            min={0}
                            max={99}
                            onChange={props.handleChange}
                            style={{width: '100%'}}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={4} sm={3}>
                        <Form.Item
                          name={[field.name, 'assists']}
                          key={`assists${field.key}`}
                          fieldKey={`assists${field.fieldKey}`}
                        >
                          <InputNumber 
                            min={0}
                            max={99}
                            defaultValue={1}
                            style={{width: '100%'}}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={4} sm={3}>
                        <Form.Item
                          name={[field.name, 'isGoalie']}
                          key={`isGoalie${field.key}`}
                          fieldKey={`isGoalie${field.fieldKey}`}
                          style={{textAlign: 'center'}}
                          valuePropName='checked'
                          rules={[
                            {
                              validator(rule, value) {
                                if (!value || multipleGoalieCheck(`Team${props.teamNum}Players`)) {
                                  return Promise.resolve();
                                }
                                return Promise.reject('Selected multiple goalies');
                              }
                            }
                          ]}
                        >
                          <Checkbox />
                        </Form.Item>
                      </Col>
                    </>
                    }
                    <Col xs={2}>
                      <MinusCircleOutlined
                        onClick={() => {
                          remove(field.name)
                          if (props.gameStatsView) {
                            props.handleChange()
                          }
                        }}
                      />
                    </Col>
                  </Row>
                </Form.Item>
              ))}
              <Form.Item wrapperCol={{sm:24}} style={{marginLeft: '20.83333%'}}>
                <Button
                  type="primary"
                  onClick={() => {
                    add();
                  }}
                  //TODO: change float (I think theres a CSS property better than float)
                  style={{ width: '91.6667%', float: 'left'}}
                >
                  <PlusOutlined style={{ verticalAlign: "0.125em" }} /> Add Player
                </Button>
              </Form.Item>
            </div>
          );
        }}
      </Form.List>
    </>
  );
};