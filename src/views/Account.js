import React, { useEffect } from 'react'

const Home = () => {
  useEffect(() => {
    (async () => {
      const response = await fetch('https://localhost:8080/account', {
        credentials: 'include'
      });
      const something = await response.text();
      console.log(something);
    })();
  }, []);

  return (
    <div>
      <header>
        Account
      </header>
      <a href="https://localhost:8080/auth/yahoo/logout">Logout</a>
    </div>
  )
};

export default Home;
