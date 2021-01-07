import csvtojson from "csvtojson";

const transformOptions = {
    noheader: false,
    headers: [
        'name',
        'team',
        'positions',
        'PTS',
        'REB',
        'AST',
        'BLK',
        'STL',
        'FGP',
        'FTP',
        '3PM',
        'GP',
        'MIN',
        'TO'
    ],
    colParser: {
        "team": "omit",
        "positions": "omit",
        'PTS': "number",
        'REB': "number",
        'AST': "number",
        'BLK': "number",
        'STL': "number",
        'FGP': "number",
        'FTP': "number",
        '3PM': "number",
        'GP': "number",
        'MIN': "number",
        'TO': "number"
    }
};

export default class ProjectionService {
    async retrieveProjections() {
        const playerProjs = await csvtojson(transformOptions).fromFile('resources/fantasypros-ros-avg-projections.csv');
        playerProjs.map(p => {
            p.FGP = p.FGP * 100;
            p.FTP = p.FTP * 100;
            return p;
        });
        return Object.assign({}, ...playerProjs.map(p => ({ [p.name]: p })));
    }
}
