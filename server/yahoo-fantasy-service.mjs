import got from 'got';
import parser from 'fast-xml-parser';

const dodgyTeamAbbr = {
    'GS': 'GSW',
    'NO': 'NOP',
    'NY': 'NYK',
    'SA': 'SAS'
};

export default class YahooFantasyService {
    extractTeam(team, roster) {
        return {
            team_key: team.team_key,
            name: team.name,
            url: team.url,
            roster: roster,
        };
    }

    fixDodgyAbbr(teamAbbr) {
        return dodgyTeamAbbr[teamAbbr] || teamAbbr;
    }

    extractPlayer(player) {
        return {
            player_key: player.player_key,
            name: player.name.full,
            selected_position: player.selected_position.position,
            team: this.fixDodgyAbbr(player.editorial_team_abbr.toUpperCase())
        };
    }

    async retrieveMatchup(user, weekNum, date = new Date()) {
        console.log(user.token);
        const response = await got(`https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams/matchups;weeks=${weekNum}/teams/roster`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        const body = parser.parse(response.body);
        const matchup = body.fantasy_content.users.user.teams.team.matchups.matchup;

        const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];

        const team1 = matchup.teams.team[0].team_key;
        const team2 = matchup.teams.team[1].team_key;
        const teamsResponse = await got(`https://fantasysports.yahooapis.com/fantasy/v2/teams;team_keys=${team1},${team2}/roster;date=${dateString}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });

        const teamsInMatchup = parser.parse(teamsResponse.body).fantasy_content.teams.team.map(team => {
            const roster = team.roster.players.player.map(player => this.extractPlayer(player));
            return this.extractTeam(team, roster);
        });

        return {
            matchup: teamsInMatchup
        }
    }
}
