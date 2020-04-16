import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import Login from './pages/login/Login';
import Register from './pages/register/Register';

import Navbar from './components/navbar/Navbar';
import Landing from './pages/landing/Landing';
import ProtectedRoute from './components/protected-route/ProtectedRoute';
import ReverseProtectedRoute from './components/reverse-protected-route/ReverseProtectedRoute';
import Profile from './pages/profile/Profile';
import ProfileSettings from './pages/profile/ProfileSettings';
import Upload from './pages/upload/Upload';

export const history = createHistory();

class App extends React.Component {
  render = () => (
    <Router history={history}>
      <Navbar/>
      <Switch>
        <Route path="/" component={Landing} exact/>
        <Route path="/users/:id" component={Profile} />
        <ProtectedRoute path="/profile/settings" component={ProfileSettings} />
        <ProtectedRoute path="/upload" component={Upload} />
        <ReverseProtectedRoute path="/login" component={Login} />
        <ReverseProtectedRoute path="/register" component={Register}/>
        <Route path="*" component={() => <h1>Not found</h1>}/>
      </Switch>
    </Router>
  )
}

export default App;
