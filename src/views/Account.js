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
          // console still complaining about unique key prop
        matchup.matchup.map(t =><p>{t.team}</p>)
      }

      <p>
        <a href="https://localhost:8080/auth/yahoo/logout">Logout</a>
      </p>
    </div>
  )
};

export default Home;
