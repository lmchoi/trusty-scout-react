import { Scout } from './scout.mjs'

test('generate scout report for a given date', async () => {
    const scout = new Scout();
    const dateToReport = new Date(2020, 12, 22);
    const user = {
        token: ''
    };

    const scoutReport = scout.report(user, dateToReport);
    const expectedReport = {
        date: dateToReport,
        matchup: [{
            team: 'Team A',
            roster: [
                {
                    name: 'James Harden',
                    stats: {
                        pts: [30.0]
                    }
                }
            ]
        }, {
            team: 'Team B',
            roster: [
                {
                    name: 'Devin Booker',
                    stats: {
                        pts: [25.0]
                    }
                }
            ]
        }]
    };
    expect(scoutReport).toMatchObject(expectedReport)
});