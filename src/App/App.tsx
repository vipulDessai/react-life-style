import React, { Component } from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import './App.scss';
import { Universe } from '@/_components';

export class App extends Component {
    render() {
        return (
            <>
                <header>
                    <ul>
                        <li><h2>Pokemon</h2></li>
                    </ul>
                </header>
                <Universe />
            </>  
        );
    }
}