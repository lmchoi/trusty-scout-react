import got from 'got';
import parser from 'fast-xml-parser';

function extractTeam(team, roster) {
    return {
        team_key: team.team_key,
        name: team.name,
        url: team.url,
        roster: roster,
    };
}

function extractPlayer(player) {
    return {
        player_key: player.player_key,
        name: player.name.full,
        selected_position: player.selected_position.position,
        team: player.editorial_team_abbr
    };
}

const retrieveMatchup = async (token) => {
    console.log(token);
    const response = await got('https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/teams/matchups;weeks=1/teams/roster', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const body = parser.parse(response.body);
    const matchup = body.fantasy_content.users.user.teams.team.matchups.matchup;
    const teamsInMatchup = matchup.teams.team.map(team => {
        const roster = team.roster.players.player.map(player => extractPlayer(player));
        return extractTeam(team, roster);
    });
    
    return {
        teams_in_matchup: teamsInMatchup 
    }
};

export { retrieveMatchup }
