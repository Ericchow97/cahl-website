import React, { useRef } from 'react';
import { Row, Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { SeriesCarouselDisplay } from './SeriesCarouselDisplay'
import { MobileOrTablet } from '../../ResponsiveContextProvider'

export const SeriesCarousel = (props) => {
    const carousel = useRef(null);
    const mobileView = MobileOrTablet()

    const handleClick = (e) => {
        if (e.target.dataset.icon === "left") {
            carousel.current.prev()
        }
        else {
            carousel.current.next()
        }
    }
    let gameSet = []
    for (let i = 0; i < 7; i++) {
        // if there is data for recent games, populate columns, else go with default
        if (props.seriesGames[i]) {
            gameSet.push({
                id: i,
                homeName: props.team1Name,
                homeScore: props.seriesGames[i].game_result[0].team_score,
                awayName: props.team2Name,
                awayScore: props.seriesGames[i].game_result[1].team_score
            })
        } else {
            gameSet.push({
                id: i,
                homeName: props.team1Name,
                homeScore: '-',
                awayName: props.team2Name,
                awayScore: '-'
            })
        }
    }
    
    //split for mobile and desktop view
    let carouselSplit = []
    if (mobileView) {
        carouselSplit = [3, 5, 7]
    } else {
        carouselSplit = [4, 7]
    }
    return (
        <>
            <Row>
                <Carousel ref={carousel}>
                    <div>
                        <Row className="carousel-row">
                            {gameSet.slice(0, carouselSplit[0]).map((game, key) => {
                                return (
                                    <SeriesCarouselDisplay
                                        key={key}
                                        span={mobileView ? 8 : 6}
                                        id={game.id}
                                        homeName={game.homeName}
                                        homeScore={game.homeScore}
                                        awayName={game.awayName}
                                        awayScore={game.awayScore}
                                    />
                                )
                            })}
                        </Row>
                    </div>
                    <div>
                        <Row className="carousel-row">
                            {gameSet.slice(carouselSplit[0], carouselSplit[1]).map((game, key) => {
                                return (
                                    <SeriesCarouselDisplay
                                        key={key}
                                        span={mobileView ? 12: 8}
                                        id={game.id}
                                        homeName={game.homeName}
                                        homeScore={game.homeScore}
                                        awayName={game.awayName}
                                        awayScore={game.awayScore}
                                    />
                                )
                            })}
                        </Row>
                    </div>
                    {mobileView && 
                        <div>
                            <Row className="carousel-row">
                                {gameSet.slice(carouselSplit[1], carouselSplit[2]).map((game, key) => {
                                    return (
                                        <SeriesCarouselDisplay
                                            key={key}
                                            span={12}
                                            id={game.id}
                                            homeName={game.homeName}
                                            homeScore={game.homeScore}
                                            awayName={game.awayName}
                                            awayScore={game.awayScore}
                                        />
                                    )
                                })}
                            </Row>
                        </div>
                    }
                </Carousel>
                <LeftOutlined className="carousel-arrow left" onClick={(e) => handleClick(e)} />
                <RightOutlined className="carousel-arrow right" onClick={(e) => handleClick(e)} />
            </Row>
        </>
    );
}