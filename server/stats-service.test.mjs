import StatsService from './stats-service.mjs'

// TODO mock db
test('retrieve stats', async () => {
    const dateToReport = new Date('2020-12-23');
    const statsService = new StatsService();

    const retrievedStats = await statsService.retrieveStats(dateToReport, 'CJ McCollum');

    expect(retrievedStats).toMatchObject({
        'MIN': expect.anything(),
        'FGP': expect.anything(),
        'FTP': expect.anything(),
        '3PM': expect.anything(),
        'PTS': expect.anything(),
        'REB': expect.anything(),
        'AST': expect.anything(),
        'STL': expect.anything(),
        'BLK': expect.anything(),
        'TO': expect.anything()
    });
});

