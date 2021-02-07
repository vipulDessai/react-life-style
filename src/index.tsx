import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import './index.css';
import { MultiverseContextProvider, store } from './_helpers';

ReactDOM.render(
  <Provider store={store}>
    <MultiverseContextProvider>
      <App />
    </MultiverseContextProvider>
  </Provider>,
  document.getElementById('root')
);

module.hot.accept();