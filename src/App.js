import React, { useState, useEffect } from 'react';
import './App.css';
import HeaderLogo from './assets/charity-hockey-banner.jpg'
import { BrowserRouter as Router,  Switch,  Route } from "react-router-dom";
import { Helmet } from 'react-helmet'
import { Layout } from 'antd';
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
  const [ currSeriesNum, setSeriesNum ] = useState(0)
  const [ allSeries, setAllSeries ] = useState([])

  const [ activePlayers, setActivePlayers ] = useState([])
  const [ activeSeries, setActiveSeries ] = useState([])
  const [ allGames, setAllGames ] = useState([])
  const [ recentStars, setRecentStars ] = useState([])
  const [ isLoading, setLoading ] = useState(true)
  const [ isAdmin, setAdmin ] = useState(window.localStorage.getItem('admin'))

  //Reload State: when admin submits and is successful, have a refresh of all data
  const [ successfulSubmission, setSuccessfulSubmission ] = useState(false)
  const [ seriesSuccess, setSeriesSuccess ] = useState()
  const [ gameSuccess, setGameSuccess ] = useState()
  const [ players, setAllPlayers ] = useState([])

  //TODO: change all alerts to messages
  //TODO: change fetch functions to reduce reload time
  //API request to server to obtain all relevant information
  useEffect(() => {
    const fetchSeriesData = async () => {
      const seriesDataRes = await fetch(`http://127.0.0.1:8000/series/`)
      const seriesData = await seriesDataRes.json()
      const currentSeriesData =  seriesData[0]
      const seriesNum = currentSeriesData.id
      const currPlayersStatsRes = await fetch(`http://127.0.0.1:8000/players/?series_id=${seriesNum}`)
      const currPlayersStats = await currPlayersStatsRes.json()
      const gameListRes = await fetch(`http://127.0.0.1:8000/game/`)
      const gameList = await gameListRes.json()
      // if the recent game has a game summary, update the most recent stars
      if (gameList[0].game_summary) {
        const firstStarRes = await fetch(`${gameList[0].game_summary.first_star}?player_info=true`)
        const firstStar = await firstStarRes.json()
        const secondStarRes = await fetch(`${gameList[0].game_summary.second_star}?player_info=true`)
        const secondStar = await secondStarRes.json()
        const thirdStarRes = await fetch(`${gameList[0].game_summary.third_star}?player_info=true`)
        const thirdStar = await thirdStarRes.json()
        setRecentStars(firstStar)
        setRecentStars(recentStars => [recentStars, secondStar])
        setRecentStars(recentStars => [...recentStars, thirdStar])
      }  else {
        setRecentStars([])
      }
      setSeriesNum(seriesNum)
      setAllSeries(seriesData)
      setActiveSeries(currentSeriesData)
      setActivePlayers(currPlayersStats)
      setAllGames(gameList)
      setLoading(false)
      setSuccessfulSubmission(false)
    }

    const fetchPlayerData = async () => {
      const allPlayersRes = await fetch(`http://127.0.0.1:8000/players/`)
      const allPlayers = await allPlayersRes.json()
      setAllPlayers(allPlayers)
    }
    setLoading(true)
    fetchPlayerData()

    fetchSeriesData()

  }, [successfulSubmission])

  //TODO: move to the on component load so functions only run once
  // return new array with [num, player name, GP, G, A, Pts, W, L, GAA, Image]
  const getActivePlayers = () => {
    return (
      activePlayers.map(activePlayer => {
        const playerStats = {
          'games': 0, 
          'goals': 0, 
          'assists': 0, 
          'points': 0, 
          'wins': 0,
          'loss': 0,
          'ga': 0,
          'goalieGames': 0
        };
        activePlayer.stats.forEach(stats => {
          playerStats['games'] += 1;
          playerStats['goals'] += stats.goals;
          playerStats['assists'] += stats.assists;
          playerStats['points'] += stats.points;
          if (stats.is_goalie) {
            playerStats['goalieGames'] += 1;
            if (stats.win) {
              playerStats['win'] += 1;
            }
            playerStats['ga'] += stats.ga;
          }
        })
        const playerInfo = {
          'id': activePlayer.id,
          'num': activePlayer.num,
          'name': activePlayer.name,
          'image': activePlayer.image,
          'team': activePlayer.current_team
        }
        if (playerInfo.name === 'Eric Chow') {
          playerInfo.num = String.fromCharCode(960)
        }
        const player = Object.assign({}, playerInfo, playerStats)
        return player
      })
    )
  }

  const mergeSort = (arr) =>  {
    // No need to sort the array if the array only has one element or empty
    if (arr.length <= 1) {
      return arr;
    }
    // In order to divide the array in half, we need to figure out the middle
    const middle = Math.floor(arr.length / 2);
  
    // This is where we will be dividing the array into left and right
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);
  
    // Using recursion to combine the left and right
    return merge(
      mergeSort(left), mergeSort(right)
    );
  }

  function merge (left, right) {
    let resultArray = [], leftIndex = 0, rightIndex = 0;
  
    // We will concatenate values into the resultArray in order
    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex].points > right[rightIndex].points) {
        resultArray.push(left[leftIndex]);
        leftIndex++; // move left array cursor
      } else {
        resultArray.push(right[rightIndex]);
        rightIndex++; // move right array cursor
      }
    }
  
    // We need to concat here because there will be one element remaining
    // from either left OR the right
    return resultArray
            .concat(left.slice(leftIndex))
            .concat(right.slice(rightIndex));
  }

  const activePlayersStats = getActivePlayers()
  const topScorers = mergeSort(activePlayersStats).slice(0,5)

  //General TODO: update alt for img tags
  return (
    <>
    <Router>
      <Helmet titleTemplate='%s | CAHL'>
      </Helmet>
      <Layout>
        <img src={HeaderLogo} alt="CAHL Header" width="100%"/>
        <Header style={{padding:"0"}}>
          <NavigationBar 
            isAdmin={isAdmin}
          />
        </Header>
        <Content style={{padding: "0 50px"}}>
          <Switch>
            <Route exact path="/" render={() => 
              <Home 
                isLoading={isLoading}
                isAdmin={isAdmin}
                topScorers={topScorers}
                currSeriesNum={currSeriesNum}
                activeSeries={activeSeries}
                recentGame={allGames[0]}
                recentStars={recentStars}
              />}
            />
            <Route exact path="/stats" render={() => 
              <PlayersStats 
                isLoading={isLoading}
                activePlayersStats={activePlayersStats}
                activeSeries={activeSeries}
                players={players}
              />}
            />
            <Route exact path='/players/:playerId' render={()=> 
              <PlayerInfo
                players={players}
                isLoading={isLoading}
                setSuccessfulSubmission={setSuccessfulSubmission}
              />}
            />
            <Route exact path="/teams" render={() => 
              <Teams 
                isLoading={isLoading}
                isAdmin={isAdmin}
                allSeries={allSeries}
                seriesSuccess={seriesSuccess}
                setSeriesSuccess={setSeriesSuccess}
              />}
            />
            <Route exact path="/teams/:seriesId" render={() => 
              <TeamView 
                isLoading={isLoading}
                isAdmin={isAdmin}
                allSeries={allSeries}
              />}
            />
            <Route exact path='/admin/createSeries' render={()=>
              <CreateEditSeries
                isAdmin={isAdmin}
                setSuccessfulSubmission={setSuccessfulSubmission}
                setSeriesSuccess={setSeriesSuccess}
              />} 
            />
            <Route exact path="/teams/:seriesId/admin/editTeams" render={() => 
              <CreateEditSeries
                isLoading={isLoading}
                allSeries={allSeries}
                isAdmin={isAdmin}
                setSuccessfulSubmission={setSuccessfulSubmission}
                setSeriesSuccess={setSeriesSuccess}
                edit={true}
              />}
            />
            <Route exact path="/gameRecap" render={() =>
              <GameRecap
                isLoading={isLoading}
                isAdmin={isAdmin}
                allGames={allGames}
                gameSuccess={gameSuccess}
                setGameSuccess={setGameSuccess}
              />} 
            />
            <Route exact path="/gameRecap/:gameId" render={() =>
              <GameRecap
                isLoading={isLoading}
                isAdmin={isAdmin}
                allGames={allGames}
              />} 
            />
            <Route exact path='/admin/newGame' render={()=>
              <CreateEditGame
                isLoading={isLoading}
                allSeries={allSeries}
                isAdmin={isAdmin}
                setSuccessfulSubmission={setSuccessfulSubmission}
                setGameSuccess={setGameSuccess}
              />} 
            />
            <Route exact path="/gameRecap/:gameId/admin/editGame" render={() =>
              <CreateEditGame
                isLoading={isLoading}
                allSeries={allSeries}
                isAdmin={isAdmin}
                setSuccessfulSubmission={setSuccessfulSubmission}
                setGameSuccess={setGameSuccess}
                edit={true}
              />} 
            />
            <Route exact path='/login' render={() => 
              <LoginPage
                setAdmin={setAdmin}
              />} 
            />
            <Route exact path="/admin" render={() =>
              <AdminPage
                isLoading={isLoading}
                allSeries={allSeries}
                allGames={allGames}
                isAdmin={isAdmin}
                edit={true}
              />} 
            />
            <Route exact path='/logout' render={()=>
              <LogoutPage 
                setAdmin={setAdmin}
              />} 
            />
            <Route component={NoMatch} />
          </Switch>
        </Content>
        <FooterContent />
      </Layout>
    </Router>
      
    </>
  );
}

export default App;