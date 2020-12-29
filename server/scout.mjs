import YahooFantasyService from './yahoo-fantasy-service.mjs'
import ScheduleService from './schedule-service.mjs'
import ProjectionService from './projection-service.mjs'

const SEASON_START_DATE = new Date('2020-12-22');

// TODO daylight saving
function getStartOfWeek(week) {
    const copy = new Date(SEASON_START_DATE.valueOf());

    if (week === 1) {
        return copy;
    }

    copy.setDate(SEASON_START_DATE.getDate() - 1 + (7 * (week - 1)));
    return copy;
}

function nextDay(day) {
    const copy = new Date(day.valueOf());
    copy.setDate(day.getDate() + 1);
    return copy;
}

export default class Scout {

    constructor() {
        this.fantasyService = new YahooFantasyService();
        this.scheduleService = new ScheduleService();
        this.ProjectionService = new ProjectionService();
    }

    statsHasGame(stats, playerStats) {
        stats['GP'] = 1;
        stats['MIN'] = playerStats['MIN'];
        stats['FGP'] = playerStats['FGP'];
        stats['FTP'] = playerStats['FTP'];
        stats['3PM'] = playerStats['3PM'];
        stats['PTS'] = playerStats['PTS'];
        stats['REB'] = playerStats['REB'];
        stats['AST'] = playerStats['AST'];
        stats['STL'] = playerStats['STL'];
        stats['BLK'] = playerStats['BLK'];
        stats['TO'] = playerStats['TO'];
    }

    statsNoGame(stats) {
        stats['MIN'] = 0;
        stats['FGP'] = 0;
        stats['FTP'] = 0;
        stats['3PM'] = 0;
        stats['PTS'] = 0;
        stats['REB'] = 0;
        stats['AST'] = 0;
        stats['STL'] = 0;
        stats['BLK'] = 0;
        stats['TO'] = 0;
    }

    isPlayerPlaying(schedule, player) {
        // TODO fix this
        if (!schedule) {
            return false;
        }
        return (!['BN', 'IL'].includes(player.selected_position)) && schedule.get(player.team) != null;
    }

    createPlayerDailyModel(player) {
        return {
            name: player.name,
            selected_position: player.selected_position,
            team: player.team,
            stats: {
                projectedPgAvg: {
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
                },
                last5GamesPgAvg: {
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
                },
                lastSeasonPgAvg: {
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
                },
                currentSeasonPgAvg: {
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
            }
        }
    }

    generatePlayerStats(player, schedule, projections) {
        let stats = {
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

        if (this.isPlayerPlaying(schedule, player)) {
            const playerStats = projections[player.name];
            // TODO check if projections is found
            this.statsHasGame(stats, playerStats);
        } else {
            this.statsNoGame(stats);
        }

        return {
            name: player.name,
            selected_position: player.selected_position,
            team: player.team,
            stats: {
                projected: stats
            }
        }
    }

    generateTeamStats(team, schedule, projections) {
        team.roster.map(player => (this.createPlayerDailyModel(player)))
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
            const ps = player.stats.projected;
            totalStats['GP'] += ps['GP'];
            totalStats['MIN'] += ps['MIN'];
            totalStats['FGP'] += ps['FGP'];
            totalStats['FTP'] += ps['FTP'];
            totalStats['3PM'] += ps['3PM'];
            totalStats['PTS'] += ps['PTS'];
            totalStats['REB'] += ps['REB'];
            totalStats['AST'] += ps['AST'];
            totalStats['STL'] += ps['STL'];
            totalStats['BLK'] += ps['BLK'];
            totalStats['TO'] += ps['TO'];
        });

        return {
            name: team.name,
            roster: playerStats,
            teamTotal: {
                projected: totalStats
            }
        }
    }

    generateMatchupStats(teams, schedule, projections) {
        return teams.map(team => this.generateTeamStats(team, schedule, projections))
    }

    generateDayReport(date, roster, schedule, projections) {
        const scheduleForTheDay = schedule.get(date.getTime());
        return {
            date: date,
            // TODO should probably move the logic to get schedule for a particular day to the schedule service
            matchup: this.generateMatchupStats(roster.matchup, scheduleForTheDay, projections)
        };
    }

    async report(user, week) {
        console.log('report for week ' + week);

        // TODO load projections once at startup
        // once only for now until there is projections based on date
        const projections = await this.ProjectionService.retrieveProjections();

        // TODO load schedule once at startup
        await this.scheduleService.refresh();

        // get matchup for this week
        const matchup = await this.fantasyService.retrieveMatchup(user, week);
        const team1 = matchup.matchup[0].team_key;
        const team2 = matchup.matchup[1].team_key;

        const report = [];
        let dateToReport = getStartOfWeek(week);
        let nextWeek = getStartOfWeek(week + 1);
        while (dateToReport.valueOf() < nextWeek.valueOf()) {
            const roster = await this.fantasyService.retrieveRoster(user, dateToReport, team1, team2);

            // for each day, find the roster
            const schedule = await this.scheduleService.retrieveSchedule(dateToReport);
            report.push(this.generateDayReport(dateToReport, roster, schedule, projections));

            dateToReport = nextDay(dateToReport);
        }

        // put report together for the week
        return report
    }
}
