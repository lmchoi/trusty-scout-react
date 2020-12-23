import YahooFantasyService from './yahoo-fantasy-service.mjs'
import ScheduleService from './schedule-service.mjs'
import ProjectionService from './projection-service.mjs'

export default class Scout {

    constructor() {
        this.fantasyService = new YahooFantasyService();
        this.scheduleService = new ScheduleService();    
        this.ProjectionService = new ProjectionService();
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

    generateReport(date, roster, schedule, projections) {
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

    async report(user, date) {
        console.log(user.token);
        const roster = await this.fantasyService.retrieveMatchup(user, 1);
        const schedule = await this.scheduleService.retrieveSchedule(date);
        const projections = await this.ProjectionService.retrieveProjections();

        return this.generateReport(date, roster, schedule, projections);
    }
}
