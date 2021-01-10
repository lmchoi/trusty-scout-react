import React, { useEffect, useState } from 'react'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MatchupStatsTable from './MatchupStatsTable.js';

const categories = [
  'GP',
  'MIN',
  'FGM',
  'FGA',
  'FGP',//4
  'FTM',
  'FTA',
  'FTP',//7
  '3PM',
  '3PA',
  '3PP',//10
  'PTS',
  'REB',
  'AST',
  'STL',
  'BLK',
  'TO'];

function calculateCateTotal(report, teamId, stat, days = report.length) {
  let total = 0;
  let n = days < report.length ? days : report.length;
  for (let i = 0; i < n; i++) {
    let day = report[i];
    total += day.matchup[teamId].teamTotal.projected[stat];
  }
  return total;
}


function calculateDailyCateTotal(report, teamId, stat, days = report.length) {
  let day = report[days - 1];
  return day.matchup[teamId].teamTotal.projected[stat];
}

function weeklyMatchupStatsForTeam(report, daysSinceStartOfWeek, teamId) {
  const teamStats = categories.map(stat => calculateCateTotal(report, teamId, stat, daysSinceStartOfWeek));
  teamStats[4] = teamStats[2] / teamStats[3] * 100;
  teamStats[7] = teamStats[5] / teamStats[6] * 100;
  teamStats[10] = teamStats[8] / teamStats[9] * 100;
  return teamStats;
}

function dailyMatchupStatsForTeam(report, daysSinceStartOfWeek, teamId) {
  const teamStats = categories.map(stat => calculateDailyCateTotal(report, teamId, stat, daysSinceStartOfWeek));
  teamStats[4] = teamStats[2] / teamStats[3] * 100;
  teamStats[7] = teamStats[5] / teamStats[6] * 100;
  teamStats[10] = teamStats[8] / teamStats[9] * 100;
  return teamStats;
}

const Home = () => {
  const [report, setReport] = useState(null);
  const [week, setWeek] = React.useState(3);
  useEffect(() => {
    (async () => {
      const url = `https://localhost:8080/matchup?week=${week}`;
      const response = await fetch(url, {
        credentials: 'include'
      });

      setReport(await response.json());
    })();
  }, [week]);

  const [matchupStats, setMatchupStats] = useState(null);
  const [matchupStatsDaily, setMatchupStatsDaily] = useState(null);
  const [daysSinceStartOfWeek, setDaysSinceStartOfWeek] = React.useState(7);
  useEffect(() => {
    (() => {
      if (report != null) {
        console.log(report);

        const teamStats0 = weeklyMatchupStatsForTeam(report, daysSinceStartOfWeek, 0);
        const teamStats1 = weeklyMatchupStatsForTeam(report, daysSinceStartOfWeek, 1);
        setMatchupStats({
          categories: categories,
          teamName1: report[0].matchup[0].name,
          teamStats1: teamStats0,
          teamName2: report[0].matchup[1].name,
          teamStats2: teamStats1
        });

        const teamDailyStats0 = dailyMatchupStatsForTeam(report, daysSinceStartOfWeek, 0);
        const teamDailyStats1 = dailyMatchupStatsForTeam(report, daysSinceStartOfWeek, 1);
        setMatchupStatsDaily({
          categories: categories,
          teamName1: report[0].matchup[0].name,
          teamStats1: teamDailyStats0,
          teamName2: report[0].matchup[1].name,
          teamStats2: teamDailyStats1
        });
      }
    })();
  }, [report, daysSinceStartOfWeek]);

  return (
    <div>
      <header>
        Matchup
      </header>

      <FormControl >
        <InputLabel id="week-select-label">Week</InputLabel>
        <Select
          labelId="week-select-label"
          id="week-select"
          value={week}
          onChange={(e) => setWeek(e.target.value)}
        >
          {
            [...Array(10)].map((e, i) => <MenuItem value={i + 1}>{i + 1}</MenuItem>)
          }
        </Select>
      </FormControl>

      <FormControl >
        <InputLabel id="day-select-label">Days</InputLabel>
        <Select
          labelId="day-select-label"
          id="day-select"
          value={daysSinceStartOfWeek}
          defaultValue={7}
          onChange={(e) => setDaysSinceStartOfWeek(e.target.value)}
        >
          {
            [...Array(7)].map((e, i) => <MenuItem value={i + 1}>{i + 1}</MenuItem>)
          }
        </Select>
      </FormControl>

      <MatchupStatsTable stats={matchupStats} />
      <MatchupStatsTable stats={matchupStatsDaily} />
      <p>
        <a href="https://localhost:8080/auth/yahoo/logout">Logout</a>
      </p>
    </div>
  )
};

export default Home;

