import React, { useEffect, useState } from 'react'

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

function calculateCateTotal(report, teamId, stat, days = report.length) {
  let total = 0;
  let n = days < report.length ? days : report.length;
  for (let i = 0; i < n; i++) {
    let day = report[i];
    total += day.matchup[teamId].teamTotal.projected[stat];
  }
  return total;
}

const StatsTable = (prop) => {
  const matchupStats = prop.stats;
  if (matchupStats != null) {
    return (
      <table>
        <tbody>
          <tr>
            <th>Team</th>
            {
              matchupStats.categories.map(
                categoryHeader => <th>{categoryHeader}</th>
              )
            }
          </tr>
          <tr>
            <td>{matchupStats.teamName1}</td>
            {
              matchupStats.teamStats1.map(
                teamStats1 => <td>{teamStats1.toFixed(1)}</td>
              )
            }
          </tr>
          <tr>
            <td>{matchupStats.teamName2}</td>
            {
              matchupStats.teamStats2.map(
                teamStats2 => <td>{teamStats2.toFixed(1)}</td>
              )
            }
          </tr>
        </tbody>
      </table>
    )
  } else {
    return (
      <table></table>
    )
  }
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
  const [daysSinceStartOfWeek, setDaysSinceStartOfWeek] = React.useState(7);
  useEffect(() => {
    (() => {
      if (report != null) {
        console.log(report);
        // const categories = Object.keys(report[0].matchup[0].teamTotal.projected);
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
        const teamStats0 = categories.map(stat => calculateCateTotal(report, 0, stat, daysSinceStartOfWeek));
        teamStats0[4] = teamStats0[2] / teamStats0[3] * 100;
        teamStats0[7] = teamStats0[5] / teamStats0[6] * 100;
        teamStats0[10] = teamStats0[8] / teamStats0[9] * 100;
        const teamStats1 = categories.map(stat => calculateCateTotal(report, 1, stat, daysSinceStartOfWeek));
        teamStats1[4] = teamStats1[2] / teamStats1[3] * 100;
        teamStats1[7] = teamStats1[5] / teamStats1[6] * 100;
        teamStats1[10] = teamStats1[8] / teamStats1[9] * 100;
        setMatchupStats({
          categories: categories,
          teamName1: report[0].matchup[0].name,
          teamStats1: teamStats0,
          teamName2: report[0].matchup[1].name,
          teamStats2: teamStats1
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
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
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
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={6}>6</MenuItem>
          <MenuItem value={7}>7</MenuItem>
        </Select>
      </FormControl>

      <StatsTable stats={matchupStats} />
      <p>
        <a href="https://localhost:8080/auth/yahoo/logout">Logout</a>
      </p>
    </div>
  )
};

export default Home;
