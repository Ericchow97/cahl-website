import React from 'react'
import { Form, Checkbox, Input, Select } from 'antd';

const { TextArea } = Input

export const CreateGameSummary = (props) => {

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };
  const otherLayout = {
    wrapperCol: {
      xs: { span: 24 }
    }
  }

  const handleSelect = e => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      let list_element = e.target.id + '_list'
      let element_select = document.querySelector(`#${list_element} ~ div > div > div > .ant-select-item-option-active`)
      if (element_select) {
        element_select.click()
      }
    }
  }

  const options = props.starsDropdownList.map(player => ({ value: player.player_name }))

  const starList = ['First Star', 'Second Star', 'Third Star']
  return (
    <>
      <h2>Game Summary</h2>
      <Form.Item
        {...otherLayout}
        name={['game_summary', 'hidden']}
        validateTrigger={['onChange', 'onBlur']}
        valuePropName='checked'
      >
        <Checkbox >{props.hideGameSummary ? 'Show Game Summary' : 'Hide Game Summary'} </Checkbox>
      </Form.Item>
      <div style={{ display: props.hideGameSummary && 'none' }}>
        <Form.Item
          {...formItemLayout}
          label='Title'
          name={['game_summary', 'title']}
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              required: !props.hideGameSummary,
              whitespace: true,
              message: "Please input a game title",
            },
          ]}
        >
          <Input
            autoComplete='off'
            placeholder="Game Summary Title"
          />
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label='Summary'
          name={['game_summary', 'summary']}
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              required: !props.hideGameSummary,
              whitespace: true,
              message: "Please input a game summary",
            },
          ]}
        >
          <TextArea
            autoComplete='off'
            placeholder="Game Summary"
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </Form.Item>
        <Form.List name={['game_summary', 'star']}>
          {(fields) => {
            return (
              <div>
                {fields.map((field, index) => (
                  <Form.Item
                    {...formItemLayout}
                    label={starList[index]}
                    name={[field.name, 'name']}
                    key={field.key}
                    fieldKey={field.fieldKey}
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      {
                        required: !props.hideGameSummary,
                        whitespace: true,
                        message: "Please input player's name",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      onInputKeyDown={e => handleSelect(e)}
                      style={{ color: 'black', padding: '0' }}
                      placeholder="Player Name"
                      options={options}
                    >
                    </Select>
                  </Form.Item>
                ))}
              </div>
            );
          }}
        </Form.List>
      </div>
    </>
  );
}