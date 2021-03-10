import React, { Component } from 'react';
import axios from 'axios';

import { KarmaStateType, PlanetType, PokemonType } from '@/_types';
import { Pokemon } from './Pokemon';
import { connect } from 'react-redux';
import { RootState } from '@/_reducer';

interface PropsType {
    planet: PlanetType,
    karma: KarmaStateType,
}

interface StateType {
    pokemons: PokemonType[],
}

class PlanetComponent extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            pokemons: [],
        };
    }
    componentDidMount() {
        this.getAllPokemon();
    }

    getAllPokemon = async () => {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=10');
        if(response.status == 200) {
            const pokemons = response.data.results;
            this.setState({pokemons});
        }
        else {
            console.log(response);
        }
    } 
    createRandomPokemon = () => {
        // creates pokemon from fetched pokemons
    }

    render() {
        return (
            <>
                <li><p>Planet food: {this.props.planet.food} karma - {this.props.karma.qty}</p></li>
                <li>
                    <ul>
                        {
                            this.state.pokemons.map(
                                pokemon => <Pokemon key={pokemon.name} pokemon={pokemon} />
                            )
                        }
                    </ul>
                </li>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return { karma: state.karma };
};

export const Planet = connect(mapStateToProps)(PlanetComponent);