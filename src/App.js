import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Login from './pages/login/Login';
import Register from './pages/register/Register';

import Navbar from './components/navbar/Navbar';
import Landing from './pages/landing/Landing';
import ProtectedRoute from './components/protected-route/ProtectedRoute';
import ReverseProtectedRoute from './components/reverse-protected-route/ReverseProtectedRoute';
import Profile from './pages/profile/Profile';
import ProfileSettings from './pages/profile/ProfileSettings';
import Upload from './pages/upload/Upload';
import EditPhoto from './pages/edit-photo/EditPhoto';
import PhotoSearch from './pages/search/PhotoSearch';

export const history = createBrowserHistory();

class App extends React.Component {
  render = () => (
    <Router history={history} >
      <Navbar/>
      <Switch>
        <Route path="/users/:id" component={Profile} />
        <ProtectedRoute path="/photos/edit" component={EditPhoto} />
        <ProtectedRoute path="/profile/settings" component={ProfileSettings} />
        <ProtectedRoute path="/upload" component={Upload} />
        <ReverseProtectedRoute path="/login" component={Login} />
        <ReverseProtectedRoute path="/register" component={Register}/>
        <Route path="/photos/:searchTerm" component={PhotoSearch} />
        <Route path="/" component={Landing}/>
        <Route path="*" component={() => <h1>Not found</h1>}/>
      </Switch>
    </Router>
  )
}

export default App;
