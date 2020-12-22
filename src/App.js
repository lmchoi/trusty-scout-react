import { Route, Switch } from "react-router-dom";
import Home from "./views/Home";
import Account from "./views/Account";
import './App.css';

function App() {
  return (
    <main>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/account" component={Account} />
      </Switch>
    </main>
  );
}

export default App;
