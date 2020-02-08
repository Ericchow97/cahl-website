import React, { useRef } from 'react';
import { Row, Col, Carousel, Icon } from 'antd';
import { SeriesGame } from './SeriesGame';


export const SeriesCarousel = () => {
    const carousel = useRef(null);

    const handleClick = (e) => {
        if (e.target.dataset.icon === "left") {
            carousel.current.prev()
        }
        else {
            carousel.current.next()
        }
    }

    return (
        <>
            <Carousel ref={carousel}>
                <div>
                    <Row className="carousel-row">
                        <Col span= {6} className="border-series">
                            <SeriesGame id="1" home="TN 1" homeScore="2" away="TN2" awayScore="4" />
                        </Col>
                        <Col span= {6} className="border-series">
                            <SeriesGame id="2" home="TN1" homeScore="1" away="TN2" awayScore="0" />
                        </Col>
                        <Col span= {6} className="border-series">
                            <SeriesGame id="3" home="TN1" homeScore="0" away="TN2" awayScore="1" />
                        </Col>
                        <Col span= {6} className="border-series">
                            <SeriesGame id="4" home="TN1" homeScore="-" away="TN2" awayScore="-" />
                        </Col>
                    </Row>
                </div>
                <div>
                    <Row className="carousel-row">
                        <Col span= {8} className="border-series">
                            <SeriesGame id="5" home="TN1" homeScore="-" away="TN2" awayScore="-" />
                        </Col>
                        <Col span= {8} className="border-series"> 
                            <SeriesGame id="6" home="TN1" homeScore="-" away="TN2" awayScore="-" />
                        </Col>
                        <Col span= {8} className="border-series"> 
                            <SeriesGame id="7" home="TN1" homeScore="-" away="TN2" awayScore="-" />
                        </Col>
                    </Row>
                </div>
            </Carousel>
            <Icon className="carousel-arrow left" type="left" onClick= {(e) => handleClick(e)}/>
            <Icon className="carousel-arrow right" type="right" onClick= {(e) => handleClick(e)}/>
        </>
    );
}