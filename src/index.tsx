import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Context, Props } from '@/_helpers';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/context" component={Context}></Route>
      <Route path="/props" component={Props}></Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

module.hot.accept();