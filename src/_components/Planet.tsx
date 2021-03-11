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
    allPokemons: PokemonType[],
    currentPokemons: PokemonType[],
}

class PlanetComponent extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            allPokemons: [],
            currentPokemons: [],
        };
    }
    componentDidMount() {
        this.getAllPokemon();
    }

    getAllPokemon = async () => {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=10');
        if(response.status == 200) {
            const allPokemons = response.data.results;
            this.setState({allPokemons});
        }
        else {
            console.log(response);
        }
    } 
    createRandomPokemon = () => {
        const addPokemonsList = [...this.state.currentPokemons];
        const randomIndex = Math.floor(Math.random() * this.state.allPokemons.length);
        addPokemonsList.push(this.state.allPokemons[randomIndex]);
        this.setState({currentPokemons: addPokemonsList});
    }

    render() {
        return (
            <>
                <li>Planet - {this.props.planet.id} Pokemons - {this.state.currentPokemons.length} <button onClick={this.createRandomPokemon}>Create Pokemons</button></li>
                <li>
                    <ul>
                        {
                            this.state.currentPokemons.map(
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
        return { darkStone: state.DarkStone };
    };
    const mapDispatchToProps = (dispatch: any) => {
        return { dispatch };
    };
    unifiedPlanet = connect(mapStateToProps, mapDispatchToProps)(PlanetComponent);
}
else {
    unifiedPlanet = PlanetComponent;
}

export const Planet = unifiedPlanet;