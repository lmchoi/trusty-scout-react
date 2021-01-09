import YahooFantasyService from './yahoo-fantasy-service.mjs';
import ScheduleService from './schedule-service.mjs';
import StatsService from './stats-service.mjs';
import Scout from './scout.mjs'
import { jest } from '@jest/globals'

test('generate scout report for a given date', async () => {
    const scout = new Scout();
    const dateToReport = new Date('2020-12-22');
    const user = {
        token: ''
    };

    mockMatchupService();
    mockRosterService();
    mockScheduleService(dateToReport);
    mockStatsService();

    const scoutReport = await scout.report(user, 1);
    const expectedReport = {
        date: dateToReport,
        matchup: [{
            name: 'LA Kardashians',
            roster: expect.arrayContaining([{
                name: 'CJ McCollum',
                selected_position: 'PG',
                team: 'POR',
                stats: {
                    // last5PgAvg: {

                    // },
                    projected: {
                        'GP': 1,
                        'MIN': 35.6,
                        'FGP': 45.5,
                        'FTP': 77.9,
                        '3PM': 2.7,
                        'PTS': 21.4,
                        'REB': 4.1,
                        'AST': 3.8,
                        'STL': 0.8,
                        'BLK': 0.5,
                        'TO': 1.8
                    },
                    // actual: {
                    //     'GP': 1,
                    //     'MIN': 25.6,
                    //     'FGP': 35.5,
                    //     'FTP': 67.9,
                    //     '3PM': 1.5,
                    //     'PTS': 20.4,
                    //     'REB': 3.1,
                    //     'AST': 2.8,
                    //     'STL': 1.8,
                    //     'BLK': 1.5,
                    //     'TO': 2.8
                    // }
                }
            }]),
            teamTotal: {
                projected: expect.objectContaining({
                    'GP': 1
                })
            }
        }, {
            name: 'Manglre',
            roster:
                expect.arrayContaining([
                    expect.objectContaining({
                        stats: {
                            projected: expect.objectContaining(
                                {
                                    'GP': 0,
                                    'PTS': 0
                                }),
                            // last5PgAvg: {

                            // },
                            // actual: {
                            //     'GP': 0,
                            //     'MIN': 0,
                            //     'FGP': 0,
                            //     'FTP': 0,
                            //     '3PM': 0,
                            //     'PTS': 0,
                            //     'REB': 0,
                            //     'AST': 0,
                            //     'STL': 0,
                            //     'BLK': 0,
                            //     'TO': 0
                            // }
                        }
                    }),
                    expect.objectContaining({
                        stats: {
                            projected: expect.objectContaining(
                                {
                                    'GP': 1,
                                    'PTS': 11.9
                                }),
                            // last5PgAvg: {

                            // },
                            // actual: {
                            //     'GP': 0,
                            //     'MIN': 0,
                            //     'FGP': 0,
                            //     'FTP': 0,
                            //     '3PM': 0,
                            //     'PTS': 0,
                            //     'REB': 0,
                            //     'AST': 0,
                            //     'STL': 0,
                            //     'BLK': 0,
                            //     'TO': 0
                            // }
                        }
                    })
                ]),
            teamTotal: {
                projected: expect.objectContaining({
                    'GP': 1,
                    'PTS': 11.9

                })
            }
        }]
    };
    expect(scoutReport[0]).toMatchObject(expectedReport);
});

function mockMatchupService() {
    const matchupRetrieved = {
        matchup: [{
            name: 'LA Kardashians',
            team_key: '402.l.23350.t.2',
            url: 'https://basketball.fantasysports.yahoo.com/nba/23350/2'
        }, {
            name: 'Manglre',
            team_key: '402.l.23350.t.1',
            url: 'https://basketball.fantasysports.yahoo.com/nba/23350/1'
        }]
    };

    const mockRetrieveMatchup = jest.fn();
    YahooFantasyService.prototype.retrieveMatchup = mockRetrieveMatchup;
    mockRetrieveMatchup.mockReturnValue(Promise.resolve(matchupRetrieved));
}

function mockRosterService() {
    const rosterRetrieved = {
        matchup: [{
            name: 'LA Kardashians',
            team_key: '402.l.23350.t.2',
            url: 'https://basketball.fantasysports.yahoo.com/nba/23350/2',
            roster: [{
                player_key: '402.p.5161',
                name: 'CJ McCollum',
                selected_position: 'PG',
                team: 'POR',
                stats: {}
            }]
        }, {
            name: 'Manglre',
            team_key: '402.l.23350.t.1',
            url: 'https://basketball.fantasysports.yahoo.com/nba/23350/1',
            roster: [
                {
                    player_key: '402.p.5660',
                    name: 'Dejounte Murray',
                    selected_position: 'Util',
                    team: 'SA'
                },
                {
                    player_key: '402.p.4895',
                    name: 'Marcus Morris Sr.',
                    selected_position: 'BN',
                    team: 'LAC'
                },
                {
                    player_key: '402.p.5464',
                    name: 'Kristaps Porzingis',
                    selected_position: 'IL',
                    team: 'DAL'
                }
            ]
        }]
    };

    const mockRetrieveRoster = jest.fn();
    YahooFantasyService.prototype.retrieveRoster = mockRetrieveRoster;
    mockRetrieveRoster.mockReturnValue(Promise.resolve(rosterRetrieved));
}

function mockScheduleService(dateToReport) {
    const matchupsOnTheDay = new Map([
        ['POR', 'UTA'],
        ['UTA', 'POR'],
        ['SA', 'MEM'],
        ['MEM', 'SA']
    ]);

    const scheduleRetrieved = new Map([
        [dateToReport.getTime(), matchupsOnTheDay]
    ]);

    const mockRetrieveSchedule = jest.fn();
    ScheduleService.prototype.retrieveSchedule = mockRetrieveSchedule;
    mockRetrieveSchedule.mockReturnValue(Promise.resolve(scheduleRetrieved));
}

function mockStatsService() {
    const dailyStatsRetrieved = {
        'MIN': 25.6,
        'FGP': 35.5,
        'FTP': 67.9,
        '3PM': 1.5,
        'PTS': 20.4,
        'REB': 3.1,
        'AST': 2.8,
        'STL': 1.8,
        'BLK': 1.5,
        'TO': 2.8
    };
    const mockRetrieveStats = jest.fn();
    StatsService.prototype.retrieveStats = mockRetrieveStats;
    mockRetrieveStats.mockImplementation((dateToReport, playerName) => {
        if (playerName === 'CJ McCollum') {
            return Promise.resolve(dailyStatsRetrieved);
        } else {
            return Promise.resolve(null);
        }
    });
}