import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet'
import { CardTemplate } from './components/CardTemplate'
import { CAHLTeams } from './components/Teams/CAHLTeams'
import { Alert } from 'antd';

export const Teams = (props) => {
    const [ adminRedirect, setAdminRedirect ] = useState(false)

    const handleClick = () => {
        setAdminRedirect(true)
    }

    const handleClose = () => {
        props.setSeriesSuccess()
    }
    
    return (
        <>
            <Helmet>
                <title>Teams</title>
            </Helmet>
            {adminRedirect && <Redirect push to = '/admin/createSeries'/>}
            {props.seriesSuccess && 
                <Alert 
                    message={props.seriesSuccess}
                    type="success"
                    closable
                    showIcon
                    afterClose={handleClose}
                />
            }
            <CardTemplate 
                loading={props.isLoading} 
                header='Teams of CAHL' 
                style={{textAlign: 'center'}} 
                extra={props.isAdmin} 
                buttonText='New Series' 
                handleClick={handleClick}
            >
                <CAHLTeams
                    allSeries={props.allSeries}
                    isAdmin={props.isAdmin}
                    isLoading={props.isLoading}
                />
            </CardTemplate>
        </>
    )
   
}