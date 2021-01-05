import YahooFantasyService from './yahoo-fantasy-service.mjs'
import ScheduleService from './schedule-service.mjs'
import ProjectionService from './projection-service.mjs'
import StatsService from './stats-service.mjs'

// TODO what timezone is this?
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
        this.statsService = new StatsService();
    }

    setPlayerGameStats(stats, playerStats) {
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
                projected: {
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
                actual: {
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
                // // last5GamesPgAvg: {
                // // },
                // // lastSeasonPgAvg: {
                // // },
                // // currentSeasonPgAvg: {
                // // }
            }
        }
    }

    calculateProjectedPlayerStats(player, schedule, projections) {
        if (this.isPlayerPlaying(schedule, player)) {
            const playerStats = projections[player.name];
            // TODO check if projections is found
            this.setPlayerGameStats(player.stats.projected, playerStats);
        }
    }

    retrievePlayerGameStats(dateToReport, player) {
        (async () => {
            const playerStats = await this.statsService.retrieveStats(dateToReport, player.name);
            if (playerStats != null) {
                this.setPlayerGameStats(player.stats.actual, playerStats);
            }
        })();
    }

    calculateProjectedTeamTotal(playerStats) {
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

        return totalStats;
    }

    generateTeamStats(dateToReport, team, schedule, projections) {
        let playerStats = team.roster.map(player => this.createPlayerDailyModel(player));
        playerStats.forEach(player => {
            this.calculateProjectedPlayerStats(player, schedule, projections);
            this.retrievePlayerGameStats(dateToReport, player);
        });

        return {
            name: team.name,
            roster: playerStats,
            teamTotal: {
                projected: this.calculateProjectedTeamTotal(playerStats)
            }
        }
    }

    generateMatchupStats(dateToReport, teams, schedule, projections) {
        return teams.map(team => this.generateTeamStats(dateToReport, team, schedule, projections))
    }

    generateDayReport(dateToReport, roster, schedule, projections) {
        const scheduleForTheDay = schedule.get(dateToReport.getTime());
        return {
            date: dateToReport,
            // TODO should probably move the logic to get schedule for a particular day to the schedule service
            matchup: this.generateMatchupStats(dateToReport, roster.matchup, scheduleForTheDay, projections)
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

            const schedule = await this.scheduleService.retrieveSchedule(dateToReport);

            report.push(this.generateDayReport(dateToReport, roster, schedule, projections));

            dateToReport = nextDay(dateToReport);
        }

        // put report together for the week
        return report
    }
}
