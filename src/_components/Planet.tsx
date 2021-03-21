import React, { Component } from 'react';

import { DarkStoneActions, DarkStoneType, GalaxyType, MessagesActions, PlanetActions, PlanetType, PokemonType } from '@/_types';
import { Pokemon } from './Pokemon';
import { connect } from 'react-redux';
import { RootState } from '@/_reducer';

interface PropsType {
    galaxy: GalaxyType,
    planet: PlanetType,
    deletePlanet: (galaxyId: number, planetId: number) => void,
    dispatch?: any,
    darkStone?: DarkStoneType,
}

class PlanetComponent extends Component<PropsType> {
    createRandomPokemon = () => {
        const darknessReady = this.selector('darkStone');
        if(darknessReady) {
            const data = { 
                planetId: this.props.planet.id, 
                galaxyId: this.props.galaxy.id 
            };
            this.dispatcher(PlanetActions.CREATE_POKEMON, data);
            this.dispatcher(DarkStoneActions.CONSUME_DARKSTONE);
            this.dispatcher(MessagesActions.ADD_MESSAGE, 'Pokemon created!!');
        }
        else {
            this.dispatcher(MessagesActions.ADD_MESSAGE, 'Not enough darkness!!');
        }
    }
    upgradePokemon = (id: number) => {
        const darknessReady = this.selector('darkStone');
        if(darknessReady) {
            const data = { 
                creatureId: id, 
                planetId: this.props.planet.id, 
                galaxyId: this.props.galaxy.id 
            };
            this.dispatcher(PlanetActions.UPGRADE_POKEMON, data);
            this.dispatcher(DarkStoneActions.CONSUME_DARKSTONE);
            this.dispatcher(MessagesActions.ADD_MESSAGE, 'Pokemon updated!!');
        }
        else {
            this.dispatcher(MessagesActions.ADD_MESSAGE, 'Not enough darkness!!');
        }
    }
    deletePokemon = (id: number) => {
        const data = { 
            creatureId: id, 
            planetId: this.props.planet.id, 
            galaxyId: this.props.galaxy.id 
        };
        this.dispatcher(PlanetActions.KILL_POKEMON, data);
        this.dispatcher(DarkStoneActions.CREATE_DARKSTONE);
        this.dispatcher(MessagesActions.ADD_MESSAGE, 'Pokemon killed!!');
    }

    selector = (stateName: string) => {
        return this.props.darkStone.ready;
    }
    dispatcher = (type: string, data?: any) => {
        // context
        // TODO: check if context is available properly
        if(this.context.foo) {
            
        }
        // reducer
        else {
            this.props.dispatch({type, data});
        }
    }

    render() {
        const { galaxy, planet, deletePlanet } = this.props;
        const { id, creatures } = planet;
        return (
            <>
                <li>Planet - {id} Pokemons - {creatures.length} <button onClick={this.createRandomPokemon}>Create Pokemons</button><button onClick={() => deletePlanet(galaxy.id, planet.id)}>x</button></li>
                {
                    creatures.length > 0 && 
                        <li>
                            <ul>
                                {
                                    creatures.map(
                                        (pokemon, index) => <Pokemon key={index} pokemon={pokemon} deletePokemon={this.deletePokemon} upgradePokemon={this.upgradePokemon} />
                                    )
                                }
                            </ul>
                        </li>
                }
            </>
        );
    }
}

export const Planet = () => {
    if (window.location.href.indexOf('reducer') > -1) {
        const mapStateToProps = (state: RootState) => {
            return { 
                darkStone: state.Universe.darkStone
            };
        };
        const mapDispatchToProps = (dispatch: any) => {
            return { dispatch };
        };
        return connect(mapStateToProps, mapDispatchToProps)(PlanetComponent);
    }
    else {
        return PlanetComponent;
    }
};