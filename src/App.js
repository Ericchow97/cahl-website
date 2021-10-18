import React, { useState, useEffect } from 'react';
import './App.css';
import HeaderLogo from './assets/charity-hockey-banner.jpg'
import { Switch, Route } from "react-router-dom";
import { Helmet } from 'react-helmet'
import { Layout, Alert } from 'antd';
import { MobileOrTablet } from './ResponsiveContextProvider'
import { Home } from './Home';
import { PlayersStats } from './PlayersStats';
import { Teams } from './Teams';
import { TeamView } from './TeamView';
import { GameRecap } from './GameRecap';
import { LoginPage } from './LoginPage';
import { LogoutPage } from './LogoutPage';
import { CreateEditSeries } from './CreateEditSeries'
import { CreateEditGame } from './CreateEditGame'
import { NoMatch } from './NoMatch';
import { NavigationBar } from './components/NavigationBar'
import { FooterContent } from './components/FooterContent'
import { PlayerInfo } from './PlayerInfo';
import { AdminPage } from './AdminPage'

const App = () => {
  const { Header, Content } = Layout;

  //Reload State: when admin submits and is successful, have a refresh of all data
  const [successfulSubmission, setSuccessfulSubmission] = useState(1)

  // Home Page Variables
  const [currentSeries, setCurrentSeries] = useState([])
  const [recentGame, setRecentGame] = useState({})
  const [topScorers, setTopScorers] = useState([])
  const [homeLoading, setHomeLoading] = useState(true)

  // Stats page Variables
  const [currentSeriesStats, setCurrentSeriesStats] = useState([])
  const [allPlayers, setAllPlayers] = useState([])
  const [playersLoading, setPlayersLoading] = useState(true)

  // Teams page variables
  const [allSeries, setAllSeries] = useState([])
  const [allSeriesLoading, setAllSeriesLoading] = useState(true)

  // Game page variables
  const [allGames, setAllGames] = useState([])
  const [gamesLoading, setGamesLoading] = useState(true)

  // Walk On Banner Variables
  const [walkOns, setWalkOns] = useState({})
  const [gameDate, setGameDate] = useState()
  const [visible, setVisible] = useState(false);

  const handleClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    // API request for Home page
    const fetchCurrentSeriesData = async () => {
      // get series information for home current series
      const currentSeriesNumRes = fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/series/?only_id=True`)
      const currentSeriesFetch = fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/series/?first=True`)
      // get current series information for stat totals & scoring leaders
      const currentSeriesStatsRes = (await (await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/players/?series_id=${(await (await currentSeriesNumRes).json()).id}`)).json())
      const currentSeriesRes = (await (await currentSeriesFetch).json())[0]
      setCurrentSeries(currentSeriesRes)
      const topScorers = currentSeriesStatsRes.sort((a, b) => {
        if ((a.goals + a.assists) - (b.goals + b.assists) === 0) {
          if (a.goals - b.goals === 0) {
            return b.assists - a.assists
          }
          return b.goals - a.goals
        }
        return (b.goals + b.assists) - (a.goals + a.assists)
      }).slice(0, 5)
      if (currentSeriesRes.games.length > 0) {
        setRecentGame(currentSeriesRes.games[currentSeriesRes.games.length - 1])
      }
      setCurrentSeriesStats(currentSeriesStatsRes)
      setTopScorers(topScorers)
      setHomeLoading(false)
    }
    // API request for stats page
    const fetchStatsData = async () => {
      const allPlayersRes = await (await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/players/`)).json()
      // Add special player numbers
      for (let i = 0; i < allPlayersRes.length; i++) {
        if (allPlayersRes[i].name === 'Oscar Chow') {
          allPlayersRes[i].num = String.fromCharCode(960)
        } else if (allPlayersRes[i].name === 'Chad Wenzel') {
          allPlayersRes[i].num = String.fromCharCode(937)
        }
      }
      setAllPlayers(allPlayersRes)
      setPlayersLoading(false)
    }
    // API request for Teams page
    const fetchAllSeriesData = async () => {
      // fetch all series
      const allSeriesRes = await (await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/series/`)).json()
      setAllSeries(allSeriesRes)
      setAllSeriesLoading(false)
    }
    //API request for Recap Page
    const fetchGameData = async () => {
      const allGamesRes = await (await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/game/?game_ids=0,20`)).json()
      setAllGames(allGamesRes)
      setGamesLoading(false)
    }

    //API request for Walk-ons
    const fetchWalkOns = async () => {
      const [walkOns] = await (await fetch(`https://y2egtnwief.execute-api.us-east-2.amazonaws.com/production/attendance/`)).json()
      console.log(walkOns)
      setWalkOns({
        players: walkOns.players,
        goalies: walkOns.goalies,
      })
      const walkOnsDate = new Date(walkOns.date)
      const currDate = new Date(new Date().setHours(21))
      const prevSat = new Date(currDate.setDate(currDate.getDate() - (currDate.getDay() + 1)))
      const nextSat = new Date(currDate.setDate(currDate.getDate() + 7))
      setGameDate(nextSat)
      if (walkOns.players + walkOns.goalies > 0 && walkOnsDate > prevSat && walkOnsDate < nextSat) {
        setVisible(true)
      }
    }

    fetchCurrentSeriesData()
    fetchAllSeriesData()
    fetchStatsData()
    fetchGameData()
    fetchWalkOns()
  }, [successfulSubmission])

  return (
    <>
      <Helmet titleTemplate='%s | CAHL'>
      </Helmet>
      <Layout>
        {visible && <Alert
          message={`Walk-On Openings ${gameDate.toDateString()}`}
          description={`Players: ${walkOns.players} \nPlease email Ken Chow for availabilities`}
          type="info"
          showIcon
          closable
          afterClose={handleClose}
        />}
        <img src={HeaderLogo} alt="CAHL Header" width="100%" />
        <Header style={{ padding: "0" }}>
          <NavigationBar />
        </Header>
        <Content style={{ padding: MobileOrTablet() ? "0 20px" : "0 50px" }}>
          <Switch>
            <Route exact path="/" render={() =>
              <Home
                homeLoading={homeLoading}
                currentSeries={currentSeries}
                recentGame={recentGame}
                topScorers={topScorers}
              />}
            />
            <Route exact path="/stats" render={() =>
              <PlayersStats
                homeLoading={homeLoading}
                currentSeries={currentSeries}
                currentSeriesStats={currentSeriesStats}
                statsLoading={playersLoading}
                allPlayersStats={allPlayers}
              />}
            />
            <Route exact path='/players/:playerId' render={() =>
              <PlayerInfo
                allPlayers={allPlayers}
                playersLoading={playersLoading}
                setSuccessfulSubmission={setSuccessfulSubmission}
              />}
            />
            <Route exact path="/teams" render={() =>
              <Teams
                allSeriesLoading={allSeriesLoading}
                allSeries={allSeries}
              />}
            />
            <Route exact path="/teams/:seriesId" render={() =>
              <TeamView
                allSeries={allSeries}
                allSeriesLoading={allSeriesLoading}
              />}
            />
            <Route exact path={["/gameRecap", "/gameRecap/:gameId"]} render={() =>
              <GameRecap
                gamesLoading={gamesLoading}
                allGames={allGames}
                setAllGames={setAllGames}
              />}
            />
            <Route exact path={['/admin/createSeries', "/teams/:seriesId/admin/editTeams"]} render={() =>
              <CreateEditSeries
                playersLoading={playersLoading}
                allPlayers={allPlayers}
                allSeriesLoading={allSeriesLoading}
                allSeries={allSeries}
                setSuccessfulSubmission={setSuccessfulSubmission}
              />}
            />
            <Route exact path={['/admin/newGame', '/gameRecap/:gameId/admin/editGame']} render={() =>
              <CreateEditGame
                currentSeries={currentSeries}
                homeLoading={homeLoading}
                playersLoading={playersLoading}
                allPlayers={allPlayers}
                gamesLoading={gamesLoading}
                allGames={allGames}
                setSuccessfulSubmission={setSuccessfulSubmission}
              />}
            />
            <Route exact path='/login' render={() =>
              <LoginPage />}
            />
            <Route exact path="/admin" render={() =>
              <AdminPage
                allSeriesLoading={allSeriesLoading}
                allSeries={allSeries}
                gamesLoading={gamesLoading}
                allGames={allGames}
                setAllGames={setAllGames}
              />}
            />
            <Route exact path='/logout' render={() =>
              <LogoutPage />}
            />
            <Route component={NoMatch} />
          </Switch>
        </Content>
        <FooterContent />
      </Layout>
    </>
  );
}

export default App;