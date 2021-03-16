import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Galaxy } from '@/_components';
import { Messages } from '@/_components/Messages';
import { GalaxyType, MessagesActionType, DarkStoneType, DarkStoneActionType, PokemonType, PokemonAction } from '@/_types';
import { RootState } from '@/_reducer';
import { MultiverseContext } from '@/_context';
import axios from 'axios';

interface PropsType {
    message?: string,
    darkStone?: DarkStoneType,
    dispatch?: any
}

interface StateType {
    galaxies: GalaxyType[],
}

interface SnapShotType {
    message: string,
}

enum UniverseActions {
    CREATE_GALAXY = 'CREATE_GALAXY',
    CREATE_DARKSTONE = 'CREATE_DARKSTONE',
    ADD_MESSAGE = 'ADD_MESSAGE',
    DELETE_ALL_MESSAGES = 'DELETE_ALL_MESSAGES',
}

let timerPointer: NodeJS.Timer = null;

export class UniverseComponent extends Component<PropsType, StateType> {
    static context = MultiverseContext;

    constructor(props: PropsType) {
        super(props);
        this.state = {
            galaxies: []
        };

        this.getAllPokemon();
    }

    getAllPokemon = async () => {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=10');
        if(response.status == 200) {
            const allPokemons = response.data.results
                .map(
                    (pokemon: PokemonType) => {
                        pokemon.level = 0;
                        return pokemon;
                    }
                );

            // context
            // TODO: check if context is available properly
            if (this.context.foo) {

            }
            // reducer
            else {
                this.props.dispatch({ type: PokemonAction.INIT, allPokemons });
            }
        }
        else {
            console.log(response);
        }
    }

    GalaxyComponent = Galaxy();

    componentDidMount() {
        console.log('Universe Instantiated!!');
    }

    getSnapshotBeforeUpdate(prevProps: PropsType, prevStates: StateType) {
        console.log('Universe is about to be Updated!!');

        return { message: 'this is a snap before update' };
    }

    componentDidUpdate(prevProps: PropsType, prevStates: StateType, snapshot: SnapShotType) {
        snapshot && console.log(`snapshot message - ${snapshot.message}`);
        
        console.log('Universe Updated!!');
        
        if(this.props.message.length > 0) {
            clearTimeout(timerPointer);
            timerPointer = setTimeout(() => {
                this.dispatcher(UniverseActions.DELETE_ALL_MESSAGES);
            }, 5000);
        }
    }

    createGalaxy = () => {
        const darknessReady = this.props.darkStone.ready;

        // if dark stone is available, consume it and create Galaxy
        if(darknessReady) {
            const galaxies = [...this.state.galaxies];
            if(galaxies.length > 0) {
                galaxies.sort((a, b) => a.id - b.id);
                galaxies.push({ id: galaxies[galaxies.length - 1].id + 1 });
            }
            else {
                galaxies.push({id: 0});
            }

            this.setState({ galaxies });
            this.dispatcher(UniverseActions.CREATE_GALAXY);
            this.dispatcher(UniverseActions.ADD_MESSAGE, 'Darkness consumed!!');
        }
        else {
            this.dispatcher(UniverseActions.ADD_MESSAGE, 'Not enough darkness!!');
        }
    }
    destroyGalaxy = (galaxyId: number) => {
        let galaxies = [...this.state.galaxies];
        galaxies = galaxies.filter(
            galaxy => galaxy.id !== galaxyId
        ).map(
            (galaxy, index) => {
                galaxy.id = index;

                return galaxy;
            }
        );

        this.setState({ galaxies });
        this.dispatcher(UniverseActions.ADD_MESSAGE, 'Galaxy destroyed!!');
    }
    createDarkness = () => {
        let darknessReady = this.props.darkStone.ready;
        if(!darknessReady) {
            this.dispatcher(UniverseActions.CREATE_DARKSTONE);
            this.dispatcher(UniverseActions.ADD_MESSAGE, 'Darkness is spreading!!');
        }
        else {
            this.dispatcher(UniverseActions.ADD_MESSAGE, 'Please comsume the existing darkness!!');
        }
    }

    dispatcher = (type: string, messageText?: string) => {
        let dipatchType = '';
        switch (type) {
            case UniverseActions.CREATE_GALAXY:
                dipatchType = DarkStoneActionType.CONSUME;
                break;

            case UniverseActions.CREATE_DARKSTONE:
                dipatchType = DarkStoneActionType.CREATE;
                break;
            
            case UniverseActions.ADD_MESSAGE:
                dipatchType = MessagesActionType.ADD;
                break;
            
            case UniverseActions.DELETE_ALL_MESSAGES:
                dipatchType = MessagesActionType.DELETE;
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
        // console.log('universe rendered!!');
        return (
            <section>
                {
                    this.props.message && this.props.message.length > 0 && <Messages messageText={this.props.message}></Messages>
                }
                <ul>
                    <li><button onClick={this.createGalaxy}>Create Galaxy</button></li>
                    <li><button onClick={this.createDarkness}>Create Darkness</button></li>
                </ul>
                <ul>
                {
                    this.state.galaxies.map(galaxy => <this.GalaxyComponent key={galaxy.id} galaxy={galaxy} destroyGalaxy={this.destroyGalaxy} />)
                }
                </ul>
            </section>
        );
    }
}

export const Universe = () => {
    if(window.location.href.indexOf('reducer') > -1) {
        const mapStateToProps = (state: RootState) => {
            return { 
                message: state.Messages.message,
                darkStone: state.DarkStone,
            };
        };
        const mapDispatchToProps = (dispatch: any) => {
            return { dispatch };
        };
        
        return connect(mapStateToProps, mapDispatchToProps)(UniverseComponent);
    }
    else {
        return UniverseComponent;
    }
};