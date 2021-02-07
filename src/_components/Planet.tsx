import React, { Component } from 'react';
import axios from 'axios';

import { PlanetType, PokemonType } from '@/_types';
import { Pokemon } from './Pokemon';
import { connect } from 'react-redux';
import { RootState } from '@/_reducer';

interface PropsType {
    planet: PlanetType,
    state: RootState,
}

interface StateType {
    pokemons: PokemonType[],
}

class PlanetComponent extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            pokemons: [{ id: 0, name: `bulbasaur` }],
        };
    }

    getAllPokemon = async () => {
        const pokemonData = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=50');
        if(pokemonData.status == 200) {

        }
        else {
            console.log(pokemonData.data.error);
        }
    } 

    componentDidMount() {
        this.getAllPokemon();
    }

    render() {
        return (
            <ul>
                <li><p>Planet food: {this.props.planet.food} karma - {this.props.state.karma.qty}</p></li>
                <li>
                    <ul>
                        {
                            this.state.pokemons.map(
                                pokemon => <Pokemon key={pokemon.id} pokemon={pokemon} />
                            )
                        }
                    </ul>
                </li>
            </ul>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return { state };
};

export const Planet = connect(mapStateToProps)(PlanetComponent);