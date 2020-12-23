import ProjectionService from './projection-service.mjs'

test('generate projections', async () => {
    const projectionService = new ProjectionService();

    const schedule = await projectionService.retrieveProjections();
    
    expect(schedule).toHaveProperty('John Collins');
    expect(schedule).toHaveProperty('Aaron Gordon', {
        'name': 'Aaron Gordon',
        'PTS': 15.3,
        'REB': 7.6,
        'AST': 3.6,
        'BLK': 0.6,
        'STL': 0.8,
        'FGP': 0.443,
        'FTP': 0.7,
        '3PM': 1.4,
        'GP': 67,
        'MIN': 32.9,
        'TO': 1.7
    });    
});