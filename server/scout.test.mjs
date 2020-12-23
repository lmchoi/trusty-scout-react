import YahooFantasyService from './yahoo-fantasy-service.mjs';
import ScheduleService from './schedule-service.mjs';
import Scout from './scout.mjs'
import { jest } from '@jest/globals'

test('generate scout report for a given date', async () => {
    const scout = new Scout();
    const dateToReport = new Date('2020-12-23');
    const user = {
        token: ''
    };

    const matchupRetrieved = {
        matchup: [{
            name: 'LA Kardashians',
            team_key: '402.l.23350.t.2',
            url: 'https://basketball.fantasysports.yahoo.com/nba/23350/2',
            roster: [{
                player_key: '402.p.5161',
                name: 'CJ McCollum',
                selected_position: 'PG',
                team: 'POR'
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

    const mockRetrieveMatchup = jest.fn();
    YahooFantasyService.prototype.retrieveMatchup = mockRetrieveMatchup;
    mockRetrieveMatchup.mockReturnValue(Promise.resolve(matchupRetrieved));
    
    const matchupsOnTheDay = new Map([
        ['POR', 'UTA'],
        ['UTA', 'POR'],
        ['SA', 'MEM'],
        ['MEM', 'SA']
    ]);

    const scheduleRetrieved = new Map([
        [dateToReport, matchupsOnTheDay]
    ]);

    const mockRetrieveSchedule = jest.fn();
    ScheduleService.prototype.retrieveSchedule = mockRetrieveSchedule;
    mockRetrieveSchedule.mockReturnValue(Promise.resolve(scheduleRetrieved));

    const scoutReport = await scout.report(user, dateToReport);
    const expectedReport = {
        date: dateToReport,
        matchup: [{
            name: 'LA Kardashians',
            roster: expect.arrayContaining([{
                player_key: '402.p.5161',
                name: 'CJ McCollum',
                selected_position: 'PG',
                team: 'POR'
                // stats: {
                //     pts: [30.0]
                // }
            }])
        }, {
            name: 'Manglre',
            roster:
                expect.arrayContaining([{
                    player_key: '402.p.4895',
                    name: 'Marcus Morris Sr.',
                    selected_position: 'BN',
                    team: 'LAC'
                    // stats: {
                    //     pts: [25.0]
                    // }
                }, {
                    player_key: '402.p.5464',
                    name: 'Kristaps Porzingis',
                    selected_position: 'IL',
                    team: 'DAL'
                    // stats: {
                    //     pts: [0]
                    // }
                }])
        }]
    };
    expect(scoutReport).toMatchObject(expectedReport)
});