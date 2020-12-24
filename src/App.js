import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./views/Home";
import Matchup from "./views/Matchup";
import './App.css';

function App() {
  return (
    <main>
      <Switch>
        <Redirect from="/return" to="/matchup" />
        <Route path="/" exact component={Home} />
        <Route path="/matchup" component={Matchup} />
      </Switch>
    </main>
  );
}

export default App;
