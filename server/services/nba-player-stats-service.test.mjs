import NbaPlayerStatsService from './nba-player-stats-service.mjs';
import nock from 'nock';

test('retrieve matchup for a given week', async () => {
    nock('https://uk.global.nba.com')
        .get('/stats2/league/playerstats.json?conference=All&country=All&individual=All&locale=en&maxRecordsPerPage=1000&position=All&qualified=false&season=2020&seasonType=2&split=Last+5+Games&team=All&total=perGame')
        .reply(200, playerStatsResponse);

    const statsService = new NbaPlayerStatsService();

    const expectedMatchup = {
        players: [
            {
                'code': 'bradley_beal',
                'name': 'Bradley Beal',
                'stats': {
                    'GP': 5,
                    'MIN': 35.2,
                    "FGA": 25.6,
                    "FGM": 13.0,
                    'FGP': 50.8,
                    "FTA": 9.4,
                    "FTM": 8.2,
                    'FTP': 87.2,
                    "TPA": 6.4,
                    'TPM': 3.2,
                    "TPP": 50.0,
                    'PTS': 37.4,
                    'REB': 5.4,
                    'AST': 4.6,
                    'STL': 0.8,
                    'BLK': 0.8,
                    'TO': 3.2
                }
            },
            {
                "code": "nikola_jokic",
                "name": "Nikola Jokic",
                "stats": {
                    "GP": 5,
                    "MIN": 35.6,
                    "FGA": 18.0,
                    "FGM": 10.0,
                    "FGP": 55.6,
                    "FTA": 6.4,
                    "FTM": 5.2,
                    "FTP": 81.3,
                    "TPA": 4.0,
                    "TPM": 1.8,
                    "TPP": 45.0,
                    "PTS": 27.0,
                    "REB": 11.4,
                    "AST": 9.0,
                    "STL": 1.6,
                    "BLK": 0.2,
                    "TO": 5.0
                },
            }]
    };

    const matchup = await statsService.getLastFiveGamesForAllPlayers();
    expect(matchup).toMatchObject(expectedMatchup);
});

const playerStatsResponse = {
    "context": {
        "user": {
            "countryCode": "--",
            "countryName": "None",
            "locale": "en",
            "timeZone": "+01:00",
            "timeZoneCity": "Europe/Berlin"
        },
        "device": {
            "clazz": null
        }
    },
    "error": {
        "detail": null,
        "isError": "false",
        "message": null
    },
    "payload": {
        "league": {
            "id": "00",
            "name": "NBA"
        },
        "season": {
            "isCurrent": "true",
            "rosterSeasonType": 2,
            "rosterSeasonYear": "2020",
            "rosterSeasonYearDisplay": "2020-2021",
            "scheduleSeasonType": 2,
            "scheduleSeasonYear": "2020",
            "scheduleYearDisplay": "2020-2021",
            "statsSeasonType": 2,
            "statsSeasonYear": "2020",
            "statsSeasonYearDisplay": "2020-2021",
            "year": "2020",
            "yearDisplay": "2020-2021"
        },
        "inputParameters": {
            "conference": "All",
            "country": "All",
            "division": null,
            "individual": "All",
            "maxRecordsPerPage": "1000",
            "pageIndex": "0",
            "position": "All",
            "qualified": "false",
            "seasonType": "2",
            "split": "Last 5 Games",
            "statType": "points",
            "total": "perGame",
            "teamId": null
        },
        "paging": {
            "pageIndex": "0",
            "pageSize": "1000",
            "totalPages": "0.0",
            "totalRecords": "455"
        },
        "players": [
            {
                "playerProfile": {
                    "code": "bradley_beal",
                    "country": "United States",
                    "countryEn": "United States",
                    "displayAffiliation": "Florida/United States",
                    "displayName": "Bradley Beal",
                    "displayNameEn": "Bradley Beal",
                    "dob": "741240000000",
                    "draftYear": "2012",
                    "experience": "8",
                    "firstInitial": "B",
                    "firstName": "Bradley",
                    "firstNameEn": "Bradley",
                    "height": "1.90",
                    "jerseyNo": "3",
                    "lastName": "Beal",
                    "lastNameEn": "Beal",
                    "leagueId": "00",
                    "playerId": "203078",
                    "position": "G",
                    "schoolType": "College",
                    "weight": "93.9 kg"
                },
                "teamProfile": {
                    "abbr": "WAS",
                    "city": "Washington",
                    "cityEn": "Washington",
                    "code": "wizards",
                    "conference": "Eastern",
                    "displayAbbr": "WAS",
                    "displayConference": "Eastern",
                    "division": "Southeast",
                    "id": "1610612764",
                    "isAllStarTeam": false,
                    "isLeagueTeam": true,
                    "leagueId": "00",
                    "name": "Wizards",
                    "nameEn": "Wizards"
                },
                "statAverage": {
                    "assistsPg": 4.6,
                    "blocksPg": 0.8,
                    "defRebsPg": 3.6,
                    "efficiency": null,
                    "fgaPg": 25.6,
                    "fgmPg": 13.0,
                    "fgpct": 50.8,
                    "foulsPg": 2.4,
                    "ftaPg": 9.4,
                    "ftmPg": 8.2,
                    "ftpct": 87.2,
                    "games": 5,
                    "gamesStarted": 5,
                    "minsPg": 35.2,
                    "offRebsPg": 1.8,
                    "pointsPg": 37.4,
                    "rebsPg": 5.4,
                    "stealsPg": 0.8,
                    "tpaPg": 6.4,
                    "tpmPg": 3.2,
                    "tppct": 50.0,
                    "turnoversPg": 3.2
                },
                "statTotal": {
                    "assists": 23,
                    "blocks": 4,
                    "defRebs": 18,
                    "fga": 128,
                    "fgm": 65,
                    "fgpct": 50.8,
                    "fouls": 12,
                    "fta": 47,
                    "ftm": 41,
                    "ftpct": 87.2,
                    "mins": 0,
                    "offRebs": 9,
                    "points": 187,
                    "rebs": 27,
                    "secs": 0,
                    "steals": 4,
                    "tpa": 32,
                    "tpm": 16,
                    "tppct": 50.0,
                    "turnovers": 16
                },
                "rank": "1"
            },
            {
                "playerProfile": {
                    "code": "nikola_jokic",
                    "country": "Serbia",
                    "countryEn": "Serbia",
                    "displayAffiliation": "Mega Basket/Serbia",
                    "displayName": "Nikola Jokic",
                    "displayNameEn": "Nikola Jokic",
                    "dob": "793170000000",
                    "draftYear": "2014",
                    "experience": "5",
                    "firstInitial": "N",
                    "firstName": "Nikola",
                    "firstNameEn": "Nikola",
                    "height": "2.13",
                    "jerseyNo": "15",
                    "lastName": "Jokic",
                    "lastNameEn": "Jokic",
                    "leagueId": "00",
                    "playerId": "203999",
                    "position": "C",
                    "schoolType": "International",
                    "weight": "128.8 kg"
                },
                "teamProfile": {
                    "abbr": "DEN",
                    "city": "Denver",
                    "cityEn": "Denver",
                    "code": "nuggets",
                    "conference": "Western",
                    "displayAbbr": "DEN",
                    "displayConference": "Western",
                    "division": "Northwest",
                    "id": "1610612743",
                    "isAllStarTeam": false,
                    "isLeagueTeam": true,
                    "leagueId": "00",
                    "name": "Nuggets",
                    "nameEn": "Nuggets"
                },
                "statAverage": {
                    "assistsPg": 9.0,
                    "blocksPg": 0.2,
                    "defRebsPg": 8.8,
                    "efficiency": null,
                    "fgaPg": 18.0,
                    "fgmPg": 10.0,
                    "fgpct": 55.6,
                    "foulsPg": 4.6,
                    "ftaPg": 6.4,
                    "ftmPg": 5.2,
                    "ftpct": 81.3,
                    "games": 5,
                    "gamesStarted": 5,
                    "minsPg": 35.6,
                    "offRebsPg": 2.6,
                    "pointsPg": 27.0,
                    "rebsPg": 11.4,
                    "stealsPg": 1.6,
                    "tpaPg": 4.0,
                    "tpmPg": 1.8,
                    "tppct": 45.0,
                    "turnoversPg": 5.0
                },
                "statTotal": {
                    "assists": 45,
                    "blocks": 1,
                    "defRebs": 44,
                    "fga": 90,
                    "fgm": 50,
                    "fgpct": 55.6,
                    "fouls": 23,
                    "fta": 32,
                    "ftm": 26,
                    "ftpct": 81.3,
                    "mins": 0,
                    "offRebs": 13,
                    "points": 135,
                    "rebs": 57,
                    "secs": 0,
                    "steals": 8,
                    "tpa": 20,
                    "tpm": 9,
                    "tppct": 45.0,
                    "turnovers": 25
                },
                "rank": "8"
            }
        ]
    }
}