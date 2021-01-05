TODO
* I want to know how accurate is the projections against real data
* I want to know the FG %
* I want to know about the other teams that week
* I want to know which player is doing better than expected
* I want to know which player to add/drop

FIX
Consider fetching schedule from nba.com instead of XML

how to allow for updates to stats/schedules after already fetched?


SPEED
store stats by player


by player - list player
past 5 games
last season

USE BY OTHER TEAMS
projected FGs FTs %
show team name
other matchups - based on games scheduled instead of roster
  
NICE TO HAVE
find total number of weeks
default to current week
  
CS
schedule.xml is not in UTC
date library, fix timezone bug

Stat service - need to convert full name to player code correctly
// Karl-Anthony Towns -> karl-anthony_towns
// T.J. Warren (t.j._warren) -> tj_warren
// Marcus Morris Sr. (marcus_morris sr.) -> marcus_morris

// injured players
// Klay Thompson (klay_thompson)
// Kristaps Porzingis (kristaps_porzingis)

// TODO find all names from yahoo, projections, nba.com