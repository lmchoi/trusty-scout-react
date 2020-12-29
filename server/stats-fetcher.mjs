import PouchDB from 'pouchdb';
import got from 'got';
import { raw } from 'express';
const db = new PouchDB('scoutdb');

// TODO extract to date class
function nextDay(day) {
    const copy = new Date(day.valueOf());
    copy.setDate(day.getDate() + 1);
    return copy;
}

export default class StatsFetcher {
    async addPlayerGameStats(gameSnapshotResponse) {
        const gameTime = gameSnapshotResponse.payload.gameProfile.utcMillis
        await (async () => {
            await this.addPlayerStats(gameSnapshotResponse.payload.homeTeam.gamePlayers, gameTime);
            await this.addPlayerStats(gameSnapshotResponse.payload.awayTeam.gamePlayers, gameTime);
        })();
    }

    async addPlayerStats(playersFromTeam, gameTime) {
        for (const retrievedPlayerData of playersFromTeam) {
            const playerObj = await this.getPlayer(retrievedPlayerData.profile.code);
            playerObj.gameStats[Number(gameTime)] = retrievedPlayerData.statTotal;
            await db.put(playerObj);
        }
    }

    async fetch() {
        let gameStatsDoc = await this.getGameStatsDoc();

        const statsDate = nextDay(new Date(gameStatsDoc.lastUpdated));
        const gameDayStatsResponse = await this.retrieveGameDayStats(statsDate);

        await (async () => {
            let gamesFetched = [];
            for (const game of this.extractGamesFromResponse(gameDayStatsResponse)) {

                if (this.hasGameCompleted(game)) {
                    const gameId = game.gameId;

                    const gameSnapshotResponse = await got(`https://uk.global.nba.com/stats2/game/snapshot.json?gameId=${gameId}`).json();

                    try {
                        await db.put({
                            "_id": gameId,
                            "stats": gameSnapshotResponse
                        });

                        await this.addPlayerGameStats(gameSnapshotResponse);

                        gamesFetched.push({
                            date: statsDate,
                            id: gameId
                        });
                    } catch (e) {
                        if (e.status !== 409) {
                            throw e;
                        }
                    }
                }
            }

            console.log(gamesFetched.length + " game(s) fetched");
            if (gamesFetched.length > 0 || gameDayStatsResponse.payload.gameDates[0].games.length === 0) {
                gameStatsDoc.lastUpdated = statsDate;
                gameStatsDoc.games = gameStatsDoc.games.concat(gamesFetched);
                await db.put(gameStatsDoc);
            }
        })();

        return gameStatsDoc;
    }

    hasGameCompleted(game) {
        // as defined in the NBA.com API
        return game.status === '3';
    }

    extractGamesFromResponse(gameDayStatsResponse) {
        return gameDayStatsResponse.payload.gameDates[0].games;
    }

    async retrieveGameDayStats(statsDate) {
        const statsDateString = statsDate.toLocaleDateString('en-CA');
        const gamesResponse = await got(`https://uk.global.nba.com/stats2/scores/gamedaystatus.json?gameDate=${statsDateString}`).json();
        return gamesResponse;
    }

    async getGameStatsDoc() {
        let gameStatsDoc;
        try {
            gameStatsDoc = await db.get('gamestats');
        }
        catch (e) {
            console.log(e);
            if (e.status === 404) {
                gameStatsDoc = {
                    "_id": "gamestats",
                    "lastUpdated": new Date('2020-12-21'),
                    "games": []
                };
            }
        }
        return gameStatsDoc;
    }

    async getPlayer(name) {
        let player;
        try {
            player = await db.get(name);
        }
        catch (e) {
            if (e.status === 404) {
                player = {
                    "_id": name,
                    gameStats: {}
                };
            }
        }
        return player;
    }

    async fetchGameStats(gameId) {
        return await db.get(gameId);
    }

    async fetchPlayerStats(playerName) {
        return await db.get(playerName);
    }
}
