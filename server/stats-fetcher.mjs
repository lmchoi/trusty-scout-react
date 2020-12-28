import PouchDB from 'pouchdb';
import got from 'got';
const db = new PouchDB('scoutdb');

// TODO extract to date class
function nextDay(day) {
    const copy = new Date(day.valueOf());
    copy.setDate(day.getDate() + 1);
    return copy;
}

export default class StatsFetcher {

    async fetch() {
        let gameStatsDoc;
        try {
            gameStatsDoc = await db.get('gamestats');
        } catch (e) {
            console.log(e);
            if (e.status === 404) {
                gameStatsDoc = {
                    "_id": "gamestats",
                    "lastUpdated": new Date('2020-12-21'),
                    "games": []
                };
            }
        }

        const statsDate = nextDay(new Date(gameStatsDoc.lastUpdated));
        const statsDateString = statsDate.toLocaleDateString('en-CA');
        const gamesResponse = await got(`https://uk.global.nba.com/stats2/scores/gamedaystatus.json?gameDate=${statsDateString}`).json();

        const gamesFetched = [];
        gamesResponse.payload.gameDates[0].games.forEach((game) => {
            if (game.status === '3') {
                const gameId = game.gameId;
                const response = got(`https://uk.global.nba.com/stats2/game/snapshot.json?gameId=${gameId}`).json();

                try {
                    db.put({
                        "_id": gameId,
                        "stats": response
                    });

                    gamesFetched.push({
                        date: statsDate,
                        id: gameId
                    });
                } catch (e) {
                    if (e.status !== 409) {
                        console.log(e);
                        throw e;
                    }
                }
            }
        });

        if (gamesFetched.length > 0 || gamesResponse.payload.gameDates[0].games.length === 0) {
            gameStatsDoc.lastUpdated = statsDate;
            gameStatsDoc.games = gameStatsDoc.games.concat(gamesFetched);
            db.put(gameStatsDoc);
        }

        return gameStatsDoc;
    }
}
