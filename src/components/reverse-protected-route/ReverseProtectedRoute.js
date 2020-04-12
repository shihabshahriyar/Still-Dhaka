import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

const ReverseProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route {...rest} render={(props) => (
    isAuthenticated === false
      ? <Component {...props} />
      : <Redirect to={{
          pathname: '/',
          state: { from: props.location }
        }} />
  )} />
);

const mapStateToProps = (state) => {
    return {
        isAuthenticated: !!state.auth.id
    }
}

export default connect(mapStateToProps)(ReverseProtectedRoute);
