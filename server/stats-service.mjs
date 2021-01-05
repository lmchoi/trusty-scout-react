import PouchDB from 'pouchdb';
const db = new PouchDB('scoutdb');

export default class StatsService {

    async retrieveStats(dateToReport, playerName) {
        const playerCode = playerName.toLowerCase().replace(' ', '_');

        try {
            const player = await db.get(playerCode);
            const playerGameStats = player.gameStats[dateToReport.valueOf()];

            if (playerGameStats != null) {
                return {
                    'MIN': playerGameStats.mins,
                    'FGP': playerGameStats.fgpct,
                    'FTP': playerGameStats.ftpct,
                    '3PM': playerGameStats.tpm,
                    'PTS': playerGameStats.points,
                    'REB': playerGameStats.rebs,
                    'AST': playerGameStats.assists,
                    'STL': playerGameStats.steals,
                    'BLK': playerGameStats.blocks,
                    'TO': playerGameStats.turnovers
                } 
            }

        } catch (e) {
            console.log(`error loading player stats for player: ${playerName} (${playerCode}) for date ${dateToReport}`);
        }

        // not played yet etc.
        return null;
    }
}