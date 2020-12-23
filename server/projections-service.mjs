import csvtojson from "csvtojson";

const playerPerGameProjections = csvtojson({
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
}).fromFile('resources/fantasypros-ros-avg-projections.csv')
    .then((playerProjs) => Object.assign({}, ...playerProjs.map(p => ({ [p.name]: p }))));

    // {
    //     name: 'CJ McCollum',
    //     PTS: 21.4,
    //     REB: 4.1,
    //     AST: 3.8,
    //     BLK: 0.5,
    //     STL: 0.8,
    //     FGP: 0.455,
    //     FTP: 0.779,
    //     '3PM': 2.7,
    //     GP: 68,
    //     MIN: 35.6,
    //     TO: 1.8
    //   }
      
export { playerPerGameProjections }
