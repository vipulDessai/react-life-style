import React, { Component } from 'react';
import axios from 'axios';

import { PlanetType, PokemonType } from '@/_types';
import { Pokemon } from './Pokemon';
import { connect } from 'react-redux';
import { RootState } from '@/_reducer';

interface PropsType {
    planet: PlanetType,
    deletePlanet: (id: number) => void,
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
            const allPokemons = response.data.results
                .map(
                    (pokemon: PokemonType) => {
                        pokemon.level = 0;
                        return pokemon;
                    }
                );
            this.setState({allPokemons});
        }
        else {
            console.log(response);
        }
    } 
    createRandomPokemon = () => {
        const addPokemonsList = [...this.state.currentPokemons];
        const randomIndex = Math.floor(Math.random() * this.state.allPokemons.length);

        const pokemon = this.state.allPokemons[randomIndex];

        // TODO: need to fix this by assigning a proper ID
        pokemon.id = addPokemonsList.length;

        addPokemonsList.push(pokemon);

        this.setState({currentPokemons: addPokemonsList});
    }
    upgradePokemon = (id: number) => {
        const currentPokemons = [...this.state.currentPokemons];
        
        currentPokemons.forEach(
            pokemon => {
                if(pokemon.id === id)
                    ++pokemon.level;
            }
        );

        this.setState({currentPokemons});
    }
    deletePokemon = (id: number) => {
        let currentPokemons = [...this.state.currentPokemons];

        currentPokemons = currentPokemons.filter(
            pokemon => {
                return pokemon.id !== id;
            }
        );

        this.setState({currentPokemons});
    }

    render() {
        const {id} = this.props.planet;
        return (
            <>
                <li>Planet - {id} Pokemons - {this.state.currentPokemons.length} <button onClick={this.createRandomPokemon}>Create Pokemons</button><button onClick={() => this.props.deletePlanet(id)}>x</button></li>
                {
                    this.state.currentPokemons.length > 0 && 
                        <li>
                            <ul>
                                {
                                    this.state.currentPokemons.map(
                                        (pokemon, index) => <Pokemon key={index} deletePokemon={this.deletePokemon} upgradePokemon={this.upgradePokemon} pokemon={pokemon} />
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
            return { darkStone: state.DarkStone };
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