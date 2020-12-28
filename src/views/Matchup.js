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
    total += day.matchup[teamId].total[stat];
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
            {
              matchupStats.categories.map(
                categoryHeader => <th>{categoryHeader}</th>
              )
            }
          </tr>
          <tr>
            {
              matchupStats.teamStats1.map(
                teamStats1 => <td>{teamStats1.toFixed(3)}</td>
              )
            }
          </tr>
          <tr>
            {
              matchupStats.teamStats2.map(
                teamStats2 => <td>{teamStats2.toFixed(3)}</td>
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
  const [week, setWeek] = React.useState(2);
  useEffect(() => {
    console.log('call api');
    (async () => {
      const url = `https://localhost:8080/matchup?week=${week}`;
      const response = await fetch(url, {
        credentials: 'include'
      });

      setReport(await response.json());
    })();
  }, [week]);

  const [matchupStats, setMatchupStats] = useState(null);
  const [daysSinceStartOfWeek, setDaysSinceStartOfWeek] = React.useState(1);
  useEffect(() => {
    console.log('set matchup stats');
    (() => {
      if (report != null) {
        const categories = Object.keys(report[0].matchup[0].total);

        setMatchupStats({
          categories: categories,
          teamStats1: categories.map(stat => calculateCateTotal(report, 0, stat, daysSinceStartOfWeek)),
          teamStats2: categories.map(stat => calculateCateTotal(report, 1, stat, daysSinceStartOfWeek))
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
        </Select>
      </FormControl>

      <FormControl >
        <InputLabel id="day-select-label">Days</InputLabel>
        <Select
          labelId="day-select-label"
          id="day-select"
          value={daysSinceStartOfWeek}
          defaultValue={1}
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
