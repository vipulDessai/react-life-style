import React, { Component } from 'react';
import axios from 'axios';

import { PlanetType, PokemonType } from '@/_types';
import { Pokemon } from './Pokemon';
import { connect } from 'react-redux';
import { RootState } from '@/_reducer';

interface PropsType {
    planet: PlanetType,
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
                <li><p>Planet food: {this.props.planet.food} Pokemons - {this.state.pokemons.length}</p></li>
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

let unifiedPlanet;

if(window.location.href.indexOf('reducer') > -1) {
    const mapStateToProps = (state: RootState) => {
        return { energy: state.Energy };
    };
    unifiedPlanet = connect(mapStateToProps)(PlanetComponent);
}
else {
    unifiedPlanet = PlanetComponent;
}

export const Planet = unifiedPlanet;