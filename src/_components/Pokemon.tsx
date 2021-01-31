import React, { Component } from 'react';
import axios from 'axios';

export class Pokemon extends Component {
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
}