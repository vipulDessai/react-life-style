import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import './App.scss';
import { Universe } from '@/_components';
import { store } from '@/_helpers';
import { MultiverseContextProvider } from '@/_context';

export class App extends Component {
    render() {
        return (
            <>
                <header>
                    <ul>
                        <li><h2>Pokemon</h2></li>
                    </ul>
                </header>
                <BrowserRouter>
                    <Link to="/reducer">Reducer</Link>
                    <br />
                    <Link to="/context">Context</Link>

                    <Switch>
                        <Route 
                            path="/reducer" 
                            component={
                                (props: any) => {
                                    let UniverseComponent = Universe();
                                    return (
                                        <Provider store={store}>
                                            <UniverseComponent {...props} />
                                        </Provider>
                                    );
                                }
                            }
                        ></Route>
                        <Route 
                            path="/context" 
                            component={
                                (props: any) => {
                                    let UniverseComponent = Universe();
                                    return (
                                        <MultiverseContextProvider>
                                            <UniverseComponent {...props} />
                                        </MultiverseContextProvider>
                                    );
                                }
                                    
                            }
                        ></Route>
                        <Route path="/context"></Route>
                    </Switch>
                </BrowserRouter>
            </>  
        );
    }
}