import React, { useEffect, useState } from 'react'

// TODO configurable days to report
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
  const [matchupStats, setMatchupStats] = useState(null);

  useEffect(() => {
    (async () => {
      const url = 'https://localhost:8080/matchup?week=1';

      const response = await fetch(url, {
        credentials: 'include'
      });

      const report = await response.json();
      const categories = Object.keys(report[0].matchup[0].total);

      setMatchupStats({
        categories: categories,
        teamStats1: categories.map(stat => calculateCateTotal(report, 0, stat)),
        teamStats2: categories.map(stat => calculateCateTotal(report, 1, stat))
      });
    })();
  }, []);

  // TODO 
  // total
  // one day only
  // since start of week
  // actual data
  // by player

  return (
    <div>
      <header>
        Matchup
      </header>

      <StatsTable stats={matchupStats} />
      <p>
        <a href="https://localhost:8080/auth/yahoo/logout">Logout</a>
      </p>
    </div>
  )
};

export default Home;


