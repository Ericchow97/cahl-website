import React from 'react';
import './App.css';
import HeaderLogo from './assets/charity-hockey-banner.jpg'
import {  BrowserRouter as Router,  Switch,  Route } from "react-router-dom";
import { Layout } from 'antd';
import { Home } from './Home';
import { Players } from './Players';
import { PlayersStats } from './PlayersStats';
import { Teams } from './Teams';
import { GameRecap } from './GameRecap';
import { NoMatch } from './NoMatch';
import { NavigationBar } from './components/NavigationBar'
import { FooterContent } from './components/FooterContent'
import { PlayerInfo } from './components/Players/PlayerInfo/PlayerInfo';

const App = () => {
  const { Header, Content } = Layout;
  return (
    <>
    <Router>
      <Layout>
        <img src={HeaderLogo} alt="CAHL Header" width="100%"/>
        <Header style={{padding:"0"}}>
          <NavigationBar />
        </Header>
        <Content style={{padding: "0 50px"}}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/players" component={Players} />
            <Route path="/stats" component={PlayersStats} />
            <Route path="/teams" component={Teams} />
            <Route path="/gameRecap" component={GameRecap} />
            <Route exact path='/players/:playerId' component={PlayerInfo} />
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