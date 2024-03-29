import React, { useState, useEffect, useContext } from 'react'
import { Form, Alert, Button, message } from 'antd';
import { SeriesAdminView } from '../Admin/SeriesAdminView'
import { Redirect } from 'react-router';
import { AdminContext } from '../../AdminContextProvider'

//functions
import { createNewSeries } from './createNewSeries'
import { editSeries } from './editSeries'

export const SeriesInstance = (props) => {
  const adminContext = useContext(AdminContext)

  const [redirect, setRedirect] = useState(false)
  const [isLoading, setLoading] = useState(true)

  const [allPlayers, setAllPlayers] = useState(props.allPlayers) // player name dropdown
  const [teamList, setTeamList] = useState([]) // ensure non-duplicate names
  const [unsuccessfulSubmission, setUnsuccessfulSubmission] = useState(false)

  //EDIT state: previous teams 
  const [team1, setTeam1] = useState({})
  const [team2, setTeam2] = useState({})
  const [invalidSeries, setInvalidSeries] = useState(false)

  const [form] = Form.useForm()

  useEffect(() => {
    // set list of previous team names
    for (let i = 0; i < props.allSeries.length; i++) {
      // if user is in edit mode, do not include the current team names
      if (props.seriesId) {
        continue
      }
      setTeamList(teamList => [...teamList, props.allSeries[i].teams[0].name, props.allSeries[i].teams[1].name])
    }

    // EDIT function: set players for each team and insert captain in first spot
    if (props.seriesId) {
      const currentSeries = props.allSeries[props.allSeries.length - props.seriesId]
      if (currentSeries) {
        currentSeries.teams.forEach(team => {
          const captainIndex = team.players.findIndex(player => player.name === team.captain)
          team.players.splice(0, 0, team.players.splice(captainIndex, 1)[0])
        })
        setTeam1(currentSeries.teams[0])
        setTeam2(currentSeries.teams[1])
        setInvalidSeries(false)
      } else {
        setInvalidSeries(true)
      }
    }
    setLoading(false)
  }, [props.allPlayers, props.allSeries, props.seriesId])

  const onFinish = async values => {
    let ret
    if (props.seriesId) {
      ret = await editSeries(values, allPlayers, team1, team2, props.seriesId, adminContext)
      if (ret.success) {
        message.success('Successfully edited series')
      }
    } else {
      ret = await createNewSeries(values, allPlayers, adminContext)
      if (ret.success) {
        message.success('Successfully created a new series')
      }
    }

    if (ret.success) {
      setRedirect(true)
      props.setSuccessfulSubmission(count => count + 1)
    } else {
      message.error(ret.message)
    }
  };

  const onFinishFailed = () => {
    setUnsuccessfulSubmission(true)
  }

  const handleClose = () => {
    setUnsuccessfulSubmission(false)
  }


  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };

  if (!invalidSeries) {
    if (!isLoading) {
      let initialValues = {}
      if (props.seriesId) {
        const team1PlayersInfo = team1.players.map(player => { return { name: player.name } })
        const team2PlayersInfo = team2.players.map(player => { return { name: player.name } })
        initialValues = {
          'Team1Name': team1.name,
          'Team2Name': team2.name,
          'Team1Players': team1PlayersInfo,
          'Team2Players': team2PlayersInfo
        }
      } else {
        initialValues = {
          'Team1Players': new Array(13).fill().map(Object),
          'Team2Players': new Array(13).fill().map(Object)
        }
      }

      return (
        <>
          {redirect && <Redirect push to='/teams' />}
          <Form
            name="create_new_series"
            {...formItemLayoutWithOutLabel}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            initialValues={initialValues}
            form={form}
          >
            <SeriesAdminView
              form={form}
              allPlayers={allPlayers}
              setAllPlayers={setAllPlayers}
              teamList={teamList}
              Team1Name={team1.name}
              team2Name={team2.name}
            />
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" style={{ marginTop: '16px' }}>
                Submit
            </Button>
            </Form.Item>
          </Form>
          {unsuccessfulSubmission &&
            <Alert
              message="Please complete the required fields"
              type="error"
              closable
              showIcon
              afterClose={() => handleClose('fail')}
            />
          }
        </>
      );
    } else {
      return <h1>Loading</h1>
    }
  } else {
    return <h1>Invalid Series</h1>
  }
}