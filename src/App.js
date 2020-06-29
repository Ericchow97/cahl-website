import React, { useState, useEffect } from 'react';
import './App.css';
import HeaderLogo from './assets/charity-hockey-banner.jpg'
import { Switch, Route } from "react-router-dom";
import { Helmet } from 'react-helmet'
import { Layout } from 'antd';
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

  // variables of states to be passed to other components
  const [isAdmin, setAdmin] = useState(window.localStorage.getItem('admin'))

  //Reload State: when admin submits and is successful, have a refresh of all data
  const [successfulSubmission, setSuccessfulSubmission] = useState(false)
  const [seriesSuccess, setSeriesSuccess] = useState()
  const [gameSuccess, setGameSuccess] = useState()

  // TODO: change fetch url when have server, and image urls

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

  useEffect(() => {
    // API request for Home page
    const fetchCurrentSeriesData = async () => {
      // get series information for home current series
      const currentSeriesNumRes = fetch(`http://127.0.0.1:8000/series/?only_id=True`)
      const currentSeriesFetch = fetch(`http://127.0.0.1:8000/series/?first=True`)
      // get current series information for stat totals & scoring leaders
      const currentSeriesStatsRes = (await (await fetch(`http://127.0.0.1:8000/players/?series_id=${(await (await currentSeriesNumRes).json()).id}`)).json())
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
      const allPlayersRes = await (await fetch(`http://127.0.0.1:8000/players/`)).json()
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
      const allSeriesRes = await (await fetch(`http://127.0.0.1:8000/series/`)).json()
      setAllSeries(allSeriesRes)
      setAllSeriesLoading(false)
    }
    //API request for Recap Page
    const fetchGameData = async () => {
      const allGamesRes = await (await fetch(`http://127.0.0.1:8000/game/?game_ids=0,20`)).json()
      setAllGames(allGamesRes)
      setGamesLoading(false)
    }
    fetchCurrentSeriesData()
    fetchAllSeriesData()
    fetchStatsData()
    fetchGameData()

  }, [successfulSubmission])

  //General TODO: update alt for img tags
  return (
    <>
      <Helmet titleTemplate='%s | CAHL'>
      </Helmet>
      <Layout>
        <img src={HeaderLogo} alt="CAHL Header" width="100%" />
        <Header style={{ padding: "0" }}>
          <NavigationBar
            isAdmin={isAdmin}
          />
        </Header>
        <Content style={{ padding: MobileOrTablet() ? "0 20px" : "0 50px" }}>
          <Switch>
            <Route exact path="/" render={() =>
              <Home
                isAdmin={isAdmin}
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
                isAdmin={isAdmin}
                allPlayers={allPlayers}
                playersLoading={playersLoading}
                setSuccessfulSubmission={setSuccessfulSubmission}
              />}
            />
            <Route exact path="/teams" render={() =>
              <Teams
                isAdmin={isAdmin}
                allSeriesLoading={allSeriesLoading}
                allSeries={allSeries}
                seriesSuccess={seriesSuccess}
                setSeriesSuccess={setSeriesSuccess}
              />}
            />
            <Route exact path="/teams/:seriesId" render={() =>
              <TeamView
                isAdmin={isAdmin}
                allSeries={allSeries}
                allSeriesLoading={allSeriesLoading}
              />}
            />
            <Route exact path={["/gameRecap", "/gameRecap/:gameId"]} render={() =>
              <GameRecap
                isAdmin={isAdmin}
                gamesLoading={gamesLoading}
                allGames={allGames}
                setAllGames={setAllGames}
                gameSuccess={gameSuccess}
                setGameSuccess={setGameSuccess}
              />}
            />
            <Route exact path={['/admin/createSeries', "/teams/:seriesId/admin/editTeams"]} render={() =>
              <CreateEditSeries
                isAdmin={isAdmin}
                playersLoading={playersLoading}
                allPlayers={allPlayers}
                allSeriesLoading={allSeriesLoading}
                allSeries={allSeries}
                setSuccessfulSubmission={setSuccessfulSubmission}
                setSeriesSuccess={setSeriesSuccess}
              />}
            />
            <Route exact path={['/admin/newGame', '/gameRecap/:gameId/admin/editGame']} render={() =>
              <CreateEditGame
                isAdmin={isAdmin}
                currentSeries={currentSeries}
                homeLoading={homeLoading}
                playersLoading={playersLoading}
                allPlayers={allPlayers}
                gamesLoading={gamesLoading}
                allGames={allGames}
                setSuccessfulSubmission={setSuccessfulSubmission}
                setGameSuccess={setGameSuccess}
              />}
            />
            <Route exact path='/login' render={() =>
              <LoginPage
                isAdmin={isAdmin}
                setAdmin={setAdmin}
              />}
            />
            <Route exact path="/admin" render={() =>
              <AdminPage
                allSeriesLoading={allSeriesLoading}
                allSeries={allSeries}
                gamesLoading={gamesLoading}
                allGames={allGames}
                isAdmin={isAdmin}
                edit={true}
              />}
            />
            <Route exact path='/logout' render={() =>
              <LogoutPage
                setAdmin={setAdmin}
              />}
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