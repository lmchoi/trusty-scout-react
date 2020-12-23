import YahooFantasyService from './yahoo-fantasy-service.mjs';

export default class Scout {

    constructor() {
        this.fantasyService = new YahooFantasyService();
    }

    // retrieveRoster(user) {
    // // new YahooFantasyService().retrieveMatchup(req.user, 1).then( (mu) => {
    // //   const matchup = mu.teams_in_matchup;
    // //   const player = matchup[0].roster[0];
      
    // //   // get projected stats for players in matchup
    // //   playerPerGameProjections.get(player.name).then(x => console.log(x));

    // //   res.send(mu);
    // // });
        
    // }

    async report(user, date) {
        console.log(user.token);
        // get roster
        const roster = await this.fantasyService.retrieveMatchup(user, 1);
        // get schedule
        // get predicted stats

        return {
            date: date,
            matchup: roster.matchup
            // matchup: [{
            //     team: 'Team A',
            //     roster: [
            //         {
            //             name: 'James Harden',
            //             stats: {
            //                 pts: [30.0]
            //             }
            //         }
            //     ]
            // }, {
            //     team: 'Team B',
            //     roster: [
            //         {
            //             name: 'Devin Booker',
            //             stats: {
            //                 pts: [25.0]
            //             }
            //         }
            //     ]
            // }]
        };
    }
}
