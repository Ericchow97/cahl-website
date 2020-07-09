import React, { useState } from 'react';
import { CardTemplate } from '../CardTemplate'
import { SeriesCard } from '../SeriesCard'
import InfiniteScroll from 'react-infinite-scroller';
import { Spin } from 'antd';


export const CAHLTeams = (props) => {
    const [previousSeries, setPreviousSeries] = useState([])
    const [currentTeamIndex, setCurrentTeamIndex] = useState(1)
    const [lastTeamIndex, setLastTeamIndex] = useState(20)
    const [isLoading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const addNewSeries = () => {
        for (let i = currentTeamIndex; i < lastTeamIndex; i++) {
            const team1 = props.allSeries[i].teams[0]
            const team2 = props.allSeries[i].teams[1]

            setPreviousSeries(previousSeries => [...previousSeries, (<SeriesCard
                key={i}
                title={`Series #${props.allSeries[i].id}`}
                team1Name={team1.name}
                team2Name={team2.name}
                team1Score={team1.series_score}
                team2Score={team2.series_score}
                captain="true"
                captain1={team1.captain}
                captain2={team2.captain}
                divider={true}
                seriesId={props.allSeries[i].id}
            />)])
        }
    }

    const loadMore = () => {
        setLoading(true)
        if (currentTeamIndex === props.allSeries.length) {
            setHasMore(false)
            setLoading(false)
            return
        }
        addNewSeries()
        setCurrentTeamIndex(lastTeamIndex)
        setLastTeamIndex(Math.min(props.allSeries.length, lastTeamIndex + 20))
        setLoading(false)
    }

    return (
        <>
            <CardTemplate header='Current Series'>
                <SeriesCard
                    title={`Series #${props.allSeries[0].id}`}
                    team1Name={props.allSeries[0].teams[0].name}
                    team2Name={props.allSeries[0].teams[1].name}
                    team1Score={props.allSeries[0].teams[0].series_score}
                    team2Score={props.allSeries[0].teams[1].series_score}
                    captain="true"
                    captain1={props.allSeries[0].teams[0].captain}
                    captain2={props.allSeries[0].teams[1].captain}
                    seriesId={props.allSeries[0].id}
                />
            </CardTemplate>
            <CardTemplate header='Previous Series'>
                <InfiniteScroll
                    loadMore={loadMore}
                    hasMore={!isLoading && hasMore}
                >
                    {previousSeries}
                    {isLoading &&
                        <div style={{ textAlign: 'center' }}>
                            <Spin />
                        </div>
                    }
                </InfiniteScroll>
            </CardTemplate>
        </>
    )
}