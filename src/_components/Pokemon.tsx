import React, { Component } from 'react';
import { PokemonType } from '@/_types';

interface PropsType {
    pokemon: PokemonType,
}

export class Pokemon extends Component<PropsType> {
    render() {
        return (
            <li>Pokemon - {this.props.pokemon.name}</li>
        );
    }
}