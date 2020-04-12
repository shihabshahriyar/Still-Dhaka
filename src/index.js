import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.scss';
import App from './App';
import 'semantic-ui-css/semantic.min.css'
import 'react-image-crop/dist/ReactCrop.css';
import './styles/styles.scss';
import { Provider } from 'react-redux';
import store from './store/store';
import {auth} from './config/firebaseConfig';
import { startGetUserDetails } from './store/actions/auth';
import { BarLoader } from 'react-spinners';

let hasRendered = false;
const renderApp = () => {
  if(!hasRendered) {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    );
    hasRendered = true;
  }
}

ReactDOM.render(
  <div className="refresh-loader">
    <BarLoader color="#4DAF7C"/>
  </div>,
  document.getElementById('root')
);

auth.onAuthStateChanged((user) => {
  if(user) {
    if(!hasRendered) {
      store.dispatch(startGetUserDetails(user.uid))
      .then(() => {
        renderApp();
      });
    }
  } else {
    renderApp();
  }
})

