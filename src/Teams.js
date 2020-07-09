import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Helmet } from 'react-helmet'
import { CardTemplate } from './components/CardTemplate'
import { CAHLTeams } from './components/Teams/CAHLTeams'
import { IsAdmin } from './AdminContextProvider'

export const Teams = (props) => {
    const [adminRedirect, setAdminRedirect] = useState(false)

    const handleClick = () => {
        setAdminRedirect(true)
    }

    return (
        <>
            <Helmet>
                <title>Teams</title>
            </Helmet>
            {adminRedirect && <Redirect push to='/admin/createSeries' />}
            <CardTemplate
                loading={props.allSeriesLoading}
                header='Teams of CAHL'
                style={{ textAlign: 'center' }}
                extra={IsAdmin()}
                buttonText='New Series'
                handleClick={handleClick}
            >
                <CAHLTeams
                    allSeries={props.allSeries}
                />
            </CardTemplate>
        </>
    )

}