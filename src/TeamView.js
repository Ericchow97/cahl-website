import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { SeriesView } from './components/TeamView/SeriesView'
import { useParams } from 'react-router-dom'
import { Redirect } from 'react-router';
import { CardTemplate } from './components/CardTemplate'

export const TeamView = (props) => {
  let { seriesId } = useParams()

  const [ adminRedirect, setAdminRedirect ] = useState(false)
  const [ isLoading, setLoading ] = useState(true)
  const [ invalidSeries, setInvalidSeries ] = useState(false)
  const [ team1Players, setTeam1Players ] = useState([])
  const [ team2Players, setTeam2Players ] = useState([])
  const [ seriesTeams, setSeriesTeams] = useState({})

  useEffect(() => {
    // fetch request to obtain all players for specific team
    const fetchPlayerData = async (teamInstance) => {
      const playerDataRes = await fetch (`http://127.0.0.1:8000/players/?team_id=${teamInstance.id}`)
      const playerData = await playerDataRes.json()
      const captainIndex = playerData.findIndex(player => player.name === teamInstance.captain)
      playerData.splice(0, 0, playerData.splice(captainIndex, 1)[0])

      return playerData
    }
    const seriesTeams = props.allSeries[props.allSeries.length - seriesId]
    if (seriesTeams) {
      setSeriesTeams(seriesTeams)
      setInvalidSeries(false)
      fetchPlayerData(seriesTeams.teams[0]).then(playerData => {
        setTeam1Players(playerData)
      })
      fetchPlayerData(seriesTeams.teams[1]).then(playerData => {
        setTeam2Players(playerData)
      })
    } else {
      setInvalidSeries(true)
    }
    
    setLoading(false)
  }, [props.isLoading])

  const handleClick = () => {
    setAdminRedirect(true)
  }

  return (
    <>
      <Helmet>
        <title>{`Series #${seriesId}`}</title>
      </Helmet>
      {adminRedirect && <Redirect push to = {`/teams/${seriesId}/admin/editTeams`}/>}
      <CardTemplate 
        loading={props.isLoading || isLoading} 
        header={`Series #${seriesId}`} 
        extra={props.isAdmin} 
        buttonText='Edit Series' 
        handleClick={handleClick}
      >
        <SeriesView
          isAdmin={props.isAdmin}
          allSeries={props.allSeries}
          seriesId={seriesId}
          invalidSeries={invalidSeries}
          team1Players={team1Players}
          team2Players={team2Players}
          seriesTeams={seriesTeams}
        />
      </CardTemplate>
    </>
  )
}