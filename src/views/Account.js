import React, { useEffect, useState } from 'react'

const Home = () => {
  const [matchup, setMatchup] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch('https://localhost:8080/account', {
        credentials: 'include'
      });
      const matchup = await response.json();
      console.log(matchup);
      setMatchup(matchup);
    })();
  }, []);

  return (
    <div>
      <header>
        Account
      </header>

      {matchup == null ?
        'Loading...' :
        matchup.teams_in_matchup.map(t =>
          // console still complaining about unique key prop
          <p>
            <a href={t.url} key={t.team_key}>{t.name}</a>
          </p>
        )
      }

      <p>
        <a href="https://localhost:8080/auth/yahoo/logout">Logout</a>
      </p>
    </div>
  )
};

export default Home;
