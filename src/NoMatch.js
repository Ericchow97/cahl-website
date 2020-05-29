import React from 'react';
import { Helmet } from 'react-helmet'

export const NoMatch = () => {
    return (
        <>
            <Helmet>
                <title>Not Found</title>
            </Helmet>
            <h1>404: Not Found</h1>
        </>
    )
}
