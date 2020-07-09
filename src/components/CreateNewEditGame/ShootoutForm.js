import React from 'react'
import { Form, Select } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select
export const ShootoutForm = props => {

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7},
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 17},
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
  
  return (
    <Form.Item
      {...formItemLayout}
      label='Shootout Winner'
      name='ShootoutWinner'
      validateTrigger={['onChange', 'onBlur']}
      rules={[
        {
          required: props.team1Score === props.team2Score,
          whitespace: true,
          message: "Game is Tied. Please select a shootout winner",
        }
      ]}
    >
      <Select
        onInputKeyDown={e => handleSelect(e)}
        style={{ color: 'black', padding: '0'}}
        placeholder="Shootout Winner"
        allowClear
        clearIcon={
          <CloseCircleOutlined style={{verticalAlign: '0.125em', color: 'black'}}/>
        }
        onSelect={props.handleChange}
      >
        <Option key={0} style={{ color: 'black' }} value={props.team1Name}>{props.team1Name}</Option>
        <Option key={1} style={{ color: 'black' }} value={props.team2Name}>{props.team2Name}</Option>
      </Select>
    </Form.Item>
  )
}
