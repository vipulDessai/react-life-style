import { MultiverseContext } from '@/_context';
import { RootState } from '@/_reducer';
import { DarkStoneActionType, DarkStoneType, GalaxyType, MessagesActionType, PlanetType } from '@/_types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Planet } from './Planet';

interface PropsType {
    galaxy: GalaxyType,
    destroyGalaxy: (galaxyId: number) => void;
    darkStone?: DarkStoneType,
    dispatch?: any, 
}

interface StateType {
    id: number,
    planets: PlanetType[]
}

export class GalaxyComponent extends Component<PropsType, StateType> {
    static context = MultiverseContext;

    constructor(props: PropsType) {
        super(props);

        this.state = {
            id: null,
            planets: []
        };
    }

    PlanetComponent = Planet();

    shouldComponentUpdate(nextProps: PropsType, nextState: StateType):boolean {
        // as of now allow update irrespectively
        return true;
    }

    static getDerivedStateFromProps(props: PropsType, state: StateType) {
        console.log('get the derived state from props');

        return {
            id: props.galaxy.id,
            planets: state.planets.length == 0 ? [{ id: 0 }] : state.planets,
        };
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        console.log(`galaxy updated!! - planet count - ${prevState.planets.length}`);
    }

    createPlanet = () => {
        // TODO: check if context is available properly
        if(this.context.foo) {
            const { dispatch } = this.context;
        }
        else {
            if(this.props.darkStone.ready) {
                const planets = [...this.state.planets];
                planets.sort((a, b) => a.id - b.id);
                planets.push({ id: planets[planets.length - 1].id + 1 });
                this.setState({planets});
                this.props.dispatch({type: DarkStoneActionType.CONSUME});
            }
            else {
                this.props.dispatch({type: MessagesActionType.ADD, messageText: 'Not enough darkness!!'});
            }
        }
    }

    render() {
        return (
            <li>
                <ul>
                    <li>Galaxy - {this.state.id} <button onClick={this.createPlanet}>Create Planet</button></li>
                    <li>
                        <ul>
                            {
                                this.state.planets.map(
                                    planet => <this.PlanetComponent key={planet.id} planet={planet} />
                                )
                            }
                        </ul>
                    </li>
                </ul>
            </li>
        );
    }
}

export const Galaxy = () => {
    if(window.location.href.indexOf('reducer') > -1) {
        const mapStateToProps = (state: RootState) => {
            return {
                darkStone: state.DarkStone,
            };
        };
        const mapDispatchToProps = (dispatch: any) => {
            return { dispatch };
        };
    
        return connect(mapStateToProps, mapDispatchToProps)(GalaxyComponent);
    }
    else {
        return GalaxyComponent;
    }
};