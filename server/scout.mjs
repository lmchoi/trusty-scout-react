import YahooFantasyService from './yahoo-fantasy-service.mjs'
import ScheduleService from './schedule-service.mjs'
import ProjectionService from './projection-service.mjs'

function getSum(total, num) {
    return Number(total) + Number(num);
}

export default class Scout {

    constructor() {
        this.fantasyService = new YahooFantasyService();
        this.scheduleService = new ScheduleService();
        this.ProjectionService = new ProjectionService();
    }

    statsHasGame(stats, playerStats) {
        stats['GP']++;
        stats['MIN'].push(playerStats['MIN']);
        stats['FGP'].push(playerStats['FGP']);
        stats['FTP'].push(playerStats['FTP']);
        stats['3PM'].push(playerStats['3PM']);
        stats['PTS'].push(playerStats['PTS']);
        stats['REB'].push(playerStats['REB']);
        stats['AST'].push(playerStats['AST']);
        stats['STL'].push(playerStats['STL']);
        stats['BLK'].push(playerStats['BLK']);
        stats['TO'].push(playerStats['TO']);
    }

    statsNoGame(stats) {
        stats['MIN'].push(0);
        stats['FGP'].push(0);
        stats['FTP'].push(0);
        stats['3PM'].push(0);
        stats['PTS'].push(0);
        stats['REB'].push(0);
        stats['AST'].push(0);
        stats['STL'].push(0);
        stats['BLK'].push(0);
        stats['TO'].push(0);
    }

    isPlayerPlaying(schedule, player) {
        return (!['BN', 'IL'].includes(player.selected_position)) && schedule.get(player.team) != null;
    }

    generatePlayerStats(player, schedule, projections) {
        let stats = {
            'GP': 0,
            'MIN': [],
            'FGP': [],
            'FTP': [],
            '3PM': [],
            'PTS': [],
            'REB': [],
            'AST': [],
            'STL': [],
            'BLK': [],
            'TO': []
        }

        if (this.isPlayerPlaying(schedule, player)) {
            const playerStats = projections[player.name];
            // TODO check if projections is found
            this.statsHasGame(stats, playerStats);
        } else {
            this.statsNoGame(stats);
        }

        return {
            player_key: player.player_key,
            name: player.name,
            selected_position: player.selected_position,
            team: player.team,
            stats: stats
        }
    }



    generateTeamStats(team, schedule, projections) {
        const playerStats = team.roster.map(player => (this.generatePlayerStats(player, schedule, projections)));
        let totalStats = {
            'GP': 0,
            'MIN': 0,
            'FGP': 0,
            'FTP': 0,
            '3PM': 0,
            'PTS': 0,
            'REB': 0,
            'AST': 0,
            'STL': 0,
            'BLK': 0,
            'TO': 0
        }

        playerStats.forEach(player => {
            // TODO need raw stats for FGs - cant count on sum of avgs!
            const ps = player.stats;
            totalStats['GP'] += ps['GP'];
            totalStats['MIN'] += ps['MIN'].reduce(getSum, 0);
            totalStats['FGP'] += ps['FGP'].reduce(getSum, 0);
            totalStats['FTP'] += ps['FTP'].reduce(getSum, 0);
            totalStats['3PM'] += ps['3PM'].reduce(getSum, 0);
            totalStats['PTS'] += ps['PTS'].reduce(getSum, 0);
            totalStats['REB'] += ps['REB'].reduce(getSum, 0);
            totalStats['AST'] += ps['AST'].reduce(getSum, 0);
            totalStats['STL'] += ps['STL'].reduce(getSum, 0);
            totalStats['BLK'] += ps['BLK'].reduce(getSum, 0);
            totalStats['TO'] += ps['TO'].reduce(getSum, 0);
        });

        return {
            name: team.name,
            roster: playerStats,
            total: totalStats
        }
    }

    generateMatchupStats(teams, schedule, projections) {
        return teams.map(team => this.generateTeamStats(team, schedule, projections))
    }

    generateDayReport(date, roster, schedule, projections) {
        return {
            date: date,
            matchup: this.generateMatchupStats(roster.matchup, schedule.get(date), projections)
        };
    }

    async report(user, date, numberOfDays) {
        console.log(user.token);
        const roster = await this.fantasyService.retrieveMatchup(user, 1, date);
        const schedule = await this.scheduleService.retrieveSchedule(date);
        const projections = await this.ProjectionService.retrieveProjections();

        return this.generateDayReport(date, roster, schedule, projections);
    }
}
