import React, { useRef } from 'react';
import { Row, Col, Carousel } from 'antd';
import { SeriesGame } from './SeriesGame';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'


export const SeriesCarousel = (props) => {
    const carousel = useRef(null);

    const handleClick = (e) => {
        if (e.target.dataset.icon === "left") {
            carousel.current.prev()
        }
        else {
            carousel.current.next()
        }
    }
    let gameSet1 = []
    let gameSet2 = []
    const setSeriesGames = (seriesScores) => {
        // set a col for each game (7 games)
        for (let i = 0; i < 7; i++) {
            // first 4 games in first set, others in second set
            if (i < 4) {
                // if there is data for recent games, populate columns, else go with default
                if (seriesScores[i]) {
                    gameSet1.push(<Col span= {6} key={i} className="border-series"><SeriesGame  id={i + 1} home={props.team1Name} homeScore={seriesScores[i].game_result[0].team_score} away={props.team2Name} awayScore={seriesScores[i].game_result[1].team_score} /></Col>)
                } else {
                    gameSet1.push(<Col span= {6} key={i} className="border-series"><SeriesGame  id={i + 1} home={props.team1Name} homeScore="-" away={props.team2Name} awayScore="-" /></Col>)
                }
            } else {
                if (seriesScores[i]) {
                    gameSet2.push(<Col span= {8} key={i} className="border-series"><SeriesGame  id={i + 1} home={props.team1Name} homeScore={seriesScores[i].game_result[0].team_score} away={props.team2Name} awayScore={seriesScores[i].game_result[1].team_score} /></Col>)
                } else {
                    gameSet2.push(<Col span= {8} key={i} className="border-series"><SeriesGame  id={i + 1} home={props.team1Name} homeScore="-" away={props.team2Name} awayScore="-" /></Col>)
                }
            }
        }
    }
    setSeriesGames(props.seriesGames)
    return (
        <>
            <Row>
                <Carousel ref={carousel}>
                    <div>
                        <Row className="carousel-row">
                            {gameSet1}
                        </Row>
                    </div>
                    <div>
                        <Row className="carousel-row">
                            {gameSet2}
                        </Row>
                    </div>
                </Carousel>
                <LeftOutlined className="carousel-arrow left" onClick= {(e) => handleClick(e)} />
                <RightOutlined className="carousel-arrow right" onClick= {(e) => handleClick(e)} />
            </Row>
        </>
    );
}