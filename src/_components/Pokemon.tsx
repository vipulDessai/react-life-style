import React, { Component } from 'react';
import { PokemonType } from '@/_types';

interface PropsType {
    pokemon: PokemonType,
    upgradePokemon: (id: number) => void,
    deletePokemon: (id: number) => void,
}

export class Pokemon extends Component<PropsType> {
    render() {
        const { pokemon, deletePokemon, upgradePokemon } = this.props;
        return (
            <li>Pokemon - {pokemon.name} <button onClick={() => deletePokemon(pokemon.id)}>x</button><button onClick={() => upgradePokemon(pokemon.id)}>^</button></li>
        );
    }
}