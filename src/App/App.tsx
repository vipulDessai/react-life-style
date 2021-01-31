import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import './App.scss';
import { Context, PropsComponent } from '@/_helpers';

export class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <header>
                    <ul>
                        <li><h2>Pokemon</h2></li>
                        <li>
                            <ul>
                                <li><Link to="/context">Context</Link></li>
                                <li><Link to="/props">Props</Link></li>
                            </ul>
                        </li>
                    </ul>
                </header>
                <Switch>
                    <Route path="/context" component={Context}></Route>
                    <Route path="/props" component={PropsComponent}></Route>
                </Switch>
                <footer></footer>
            </BrowserRouter>
        );
    }
}