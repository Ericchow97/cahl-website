import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { SeriesStats } from './components/PlayersStats/SeriesStats';
import { AllTimeStats } from './components/PlayersStats/AllTimeStats';
import { SortingStats } from './components/SortingStats';

export const PlayersStats = () => {
    const [ redirect,  changeRedirect ] = useState(false)
    const [ playerId, changeId ] = useState(null)
    
    const handleClick = (record) => {
        changeRedirect(true)
        changeId(record.id)
    }

    return (
        <>
            {redirect && <Redirect push to={"/players/" + playerId} />}
            <SortingStats tab1="Series Stats" tab2="All Time Stats">
                <SeriesStats handleClick={handleClick}/>
                <AllTimeStats handleClick={handleClick}/>
            </SortingStats>
        </>
    )
}
