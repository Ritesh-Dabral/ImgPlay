import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// COMPONENT IMPORT
import Dashboard from './Components/DashboardComponent/Dashboard';
import EditOverlay from './Components/EditOverlayComponent/EditOverlay';

/* Utility Imports */
import {BrowserRouter as Router, Switch, Redirect,Route} from 'react-router-dom';

function App() {
  return (
    <Router className="App">
      <Switch>
        <Route exact path="/" component={Dashboard}/>
        <Route exact path="/edit" component={EditOverlay}/>
        <Route exact path="/dashboard" component={Dashboard}/>
        <Route exact path="*">
          <Redirect to="/dashboard" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
