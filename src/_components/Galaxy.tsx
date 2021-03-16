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

enum GalaxyActions {
    CREATE_PLANET = 'CREATE_PLANET',
    ADD_MESSAGE = 'ADD_MESSAGE',
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
            planets: state.planets,
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
                if(planets.length > 0) {
                    planets.sort((a, b) => a.id - b.id);
                    planets.push({ id: planets[planets.length - 1].id + 1 });
                }
                else {
                    planets.push({id: 0});
                }

                this.setState({planets});
                this.dispatcher(GalaxyActions.CREATE_PLANET);
                this.dispatcher(GalaxyActions.ADD_MESSAGE, 'Planet spawned!!');
            }
            else {
                this.dispatcher(GalaxyActions.ADD_MESSAGE, 'Not enough darkness!!');
            }
        }
    }
    deletePlanet = (id: number) => {
        let planets = [...this.state.planets];
        planets = planets.filter(planet => planet.id !== id);

        this.setState({planets});
        this.dispatcher(GalaxyActions.ADD_MESSAGE, 'Planet destroyed!!');
    }

    dispatcher = (type: string, messageText?: string) => {
        let dipatchType = '';
        switch (type) {
            case GalaxyActions.CREATE_PLANET:
                dipatchType = DarkStoneActionType.CONSUME;
                break;
            
            case GalaxyActions.ADD_MESSAGE:
                dipatchType = MessagesActionType.ADD;
                break;
        
            default:
                break;
        }

        // context
        // TODO: check if context is available properly
        if(this.context.foo) {
            
        }
        // reducer
        else {
            this.props.dispatch({type: dipatchType, messageText});
        }
    }

    render() {
        const {id} = this.state;
        return (
            <li>
                <ul>
                    <li>Galaxy - {id} <button onClick={this.createPlanet}>Create Planet</button><button onClick={() => this.props.destroyGalaxy(id)}>x</button></li>
                    {
                        this.state.planets.length > 0 &&
                            <li>
                                <ul>
                                    {
                                        this.state.planets.map(
                                            planet => <this.PlanetComponent key={planet.id} deletePlanet={this.deletePlanet} planet={planet} />
                                        )
                                    }
                                </ul>
                            </li>
                    }
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