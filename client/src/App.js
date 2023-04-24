import {
  Route,
  Router,
  Switch,
  Redirect,
  BrowserRouter,
} from "react-router-dom";
import Chat from "./component/Chat";
import Room from "./component/Room";
import Main from "./component/Main";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/room" exact component={Room} />
        <Route path="/room/:id" component={Chat} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
