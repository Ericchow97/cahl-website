import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { SortingStats } from './components/SortingStats';
import { ActivePlayers } from './components/Players/ActivePlayers'
import { AllPlayers } from './components/Players/AllPlayers'


export const Players = () => {
    const [ redirect,  changeRedirect ] = useState(false)
    const [ playerId, changeId ] = useState(null)
    
    const handleClick = (record) => {
        changeRedirect(true)
        changeId(record.id)
    }
    return (
        <> 
            {redirect && <Redirect push to={"/players/" + playerId} />}
            <SortingStats tab1='Active Players' tab2='All Players'>
                <ActivePlayers handleClick={handleClick}/>
                <AllPlayers handleClick={handleClick}/>
            </SortingStats>
        </>
    )
}
