import got from 'got';
import parser from 'fast-xml-parser';

export default class YahooFantasyService {
    extractTeam(team, roster) {
        return {
            team_key: team.team_key,
            name: team.name,
            url: team.url,
            roster: roster,
        };
    }
    
    extractPlayer(player) {
        return {
            player_key: player.player_key,
            name: player.name.full,
            selected_position: player.selected_position.position,
            // TODO convert to NOP, SAS, GSW etc
            team: player.editorial_team_abbr.toUpperCase()
        };
    }
    
    async retrieveMatchup(user, weekNum) {
        console.log(user.token);
        const response = await got(`https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams/matchups;weeks=${weekNum}/teams/roster`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        });
    
        const body = parser.parse(response.body);
        const matchup = body.fantasy_content.users.user.teams.team.matchups.matchup;
        const teamsInMatchup = matchup.teams.team.map(team => {
            const roster = team.roster.players.player.map(player => this.extractPlayer(player));
            return this.extractTeam(team, roster);
        });
        
        return {
            matchup: teamsInMatchup 
        }
    }
}
