import { createNewGameFetch, createNewGameSummaryFetch } from '../Admin/GameFetchFunctions'
import { editSeriesFetch } from '../Admin/SeriesFetchFunctions'
import { addNewPlayers } from '../Admin/CommonFunctions'
import { fetchRequest } from '../Admin/CommonFunctions'
import { editPlayerFetch } from '../Admin/PlayerFetchFunctions'

export const createNewGame = async (values, allPlayers, currentSeries, team1Score, team2Score, context) => {

  const teamsInfo = [
    {
      team_name: currentSeries.teams[0].name,
      team_score: team1Score,
      shootout_win: (values.ShootoutWinner === currentSeries.teams[0].name)
    },
    {
      team_name: currentSeries.teams[1].name,
      team_score: team2Score,
      shootout_win: (values.ShootoutWinner === currentSeries.teams[1].name)
    }
  ]

  // function to add each player's stats into the newGameData dataset
  const addPlayerStats = (teamNumPlayers, teamInstance) => {
    const opposite_team = teamInstance === 0 ? 1 : 0
    const win = (teamsInfo[teamInstance].team_score > teamsInfo[opposite_team].team_score ||
      teamsInfo[teamInstance].shootout_win) ? 1 : 0

    // parse each players stats to json format 
    const teamPlayers = values[teamNumPlayers].map(player => {
      return {
        player_name: player.name,
        goals: player.goals ? player.goals : 0,
        assists: player.assists ? player.assists : 0,
        is_goalie: player.isGoalie ? 1 : 0,
        ga: player.isGoalie ? teamsInfo[opposite_team].team_score : 0,
        win: player.isGoalie ? win : 0
      }
    })
    newGameData.game_result.push({ ...teamsInfo[teamInstance], players: teamPlayers })
  }

  const createGame = async () => {
    addPlayerStats('Team1Players', 0)
    addPlayerStats('Team2Players', 1)
    const gameRet = await fetchRequest(createNewGameFetch, context, 'create', { data: newGameData })
    if (!gameRet.success) {
      return gameRet
    }
    // if game summary exists
    if (!values.game_summary.hidden) {
      const data = {
        game: gameRet.data.id,
        title: values.game_summary.title,
        summary: values.game_summary.summary,
        first_star: values.game_summary.star[0].name,
        second_star: values.game_summary.star[1].name,
        third_star: values.game_summary.star[2].name
      }
      const gameSummaryRet = await fetchRequest(createNewGameSummaryFetch, context, 'create', { data: data })
      if (!gameSummaryRet.success) {
        return gameSummaryRet
      }
    }
    return { success: true }
  }

  // edit series instance to update series score
  const updateSeriesScore = async () => {
    const teamWin = (team1Score > team2Score || values.ShootoutWinner === currentSeries.teams[0].name) ? 0 : 1
    const data = {
      teams: [
        {
          series_score: teamWin === 0 ? currentSeries.teams[0].series_score + 1 : currentSeries.teams[0].series_score
        },
        {
          series_score: teamWin === 1 ? currentSeries.teams[1].series_score + 1 : currentSeries.teams[1].series_score
        }
      ]
    }
    const ret = await fetchRequest(editSeriesFetch, context, 'update', { data: data, id: currentSeries.id })
    if (!ret.success) {
      return ret
    }
    return { success: true }
  }

  // create a new game instance on the server
  const newGameData = {
    series_id: currentSeries.id,
    num: currentSeries.games.length ? currentSeries.games.length + 1 : 1,
    game_result: []
  }

  const updatePlayerSet = async (teamPlayers, teamName) => {
    // sort through all the players from each team
    for (let i = 0; i < teamPlayers.length; i++) {
      const playerIndex = allPlayers.findIndex(player => player.name === teamPlayers[i].name)
      const playerInfo = allPlayers[playerIndex]
      // update existing player
      const data = {
        current_team: teamName,
        is_active: true,
      }
      const ret = await fetchRequest(editPlayerFetch, context, 'update', { data: data, id: playerInfo.id })
      if (!ret.success) {
        return ret
      }
    }
    return { success: true }
  }

  const addNewPlayersRes = await addNewPlayers(allPlayers, values.Team1Players, values.Team2Players)
  if (!addNewPlayersRes.success) {
    return addNewPlayersRes
  }
  const createGameRes = await createGame()
  if (!createGameRes.success) {
    return createGameRes
  }
  const updateSeriesScoreRes = await updateSeriesScore()
  if (!updateSeriesScoreRes.success) {
    return updateSeriesScoreRes
  }
  const updatePlayerSet1Res = await updatePlayerSet(values.Team1Players, values.Team1Name)
  if (!updatePlayerSet1Res.success) {
    return updatePlayerSet1Res
  }
  const updatePlayerSet2Res = await updatePlayerSet(values.Team2Players, values.Team2Name)
  if (!updatePlayerSet2Res.success) {
    return updatePlayerSet2Res
  }

  return { success: true }
};