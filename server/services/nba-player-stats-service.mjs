import got from 'got';

const STATS_URL = `https://uk.global.nba.com/stats2/league/playerstats.json?conference=All&country=All&individual=All&locale=en&maxRecordsPerPage=1000&position=All&qualified=false&season=2020&seasonType=2&split=Last+5+Games&team=All&total=perGame`;

const responseCache = new Map();

export default class NbaPlayerStatsService {    
    constructor() {
        this.last5GamesStats = new Map();
    }

    extractStats({
        games: GP,
        minsPg: MIN,
        fgaPg: FGA,
        fgmPg: FGM,
        fgpct: FGP,
        ftaPg: FTA,
        ftmPg: FTM,
        ftpct: FTP,
        tpaPg: TPA,
        tpmPg: TPM,
        tppct: TPP,
        pointsPg: PTS,
        rebsPg: REB,
        assistsPg: AST,
        stealsPg: STL,
        blocksPg: BLK,
        turnoversPg: TO
    }) {
        return ({
            GP,
            MIN,
            FGA,
            FGM,
            FGP,
            FTA,
            FTM,
            FTP,
            TPA,
            TPM,
            TPP,
            PTS,
            REB,
            AST,
            STL,
            BLK,
            TO
        })
    }

    extractPlayer(player) {
        return {
            'code': player.playerProfile.code,
            'name': player.playerProfile.displayName,
            'stats': this.extractStats(player.statAverage)
        }
    }

    refresh() {
        (async() => {
            const response = await got(STATS_URL, {cache: responseCache}).json();

            response.payload.players.forEach(p => {
                const player = this.extractPlayer(p);
                this.last5GamesStats.set(player.name, player); 
            });
        })();
    }

    getLastFiveGames(playerName) {
        return this.last5GamesStats.get(playerName);
    }
}