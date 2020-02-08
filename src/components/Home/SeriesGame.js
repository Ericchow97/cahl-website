import React from 'react';

export const SeriesGame = (props) => {
    return (
        <>
        <table className="seriesGame">
            <thead>
                <tr>
                    <td>Game {props.id}</td>
                    <td>{props.homeScore > 0 || props.awayScore > 0 ? "Final" : "Sat"}</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{props.home}</td>
                    <td>{props.homeScore}</td>
                </tr>
                <tr>
                    <td>{props.away}</td>
                    <td>{props.awayScore}</td>
                </tr>
            </tbody>    
        </table>
        </>
    )
}