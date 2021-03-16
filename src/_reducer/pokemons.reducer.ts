import { PokemonType, PokemonAction } from '@/_types';

interface StateType {
    all: PokemonType[],
}

interface ActionType {
    type: string,
    allPokemons: PokemonType[],
}

export function Pokemons(state: StateType = { all: [] }, action: ActionType) {
    switch (action.type) {
        case PokemonAction.INIT:
            return { all: action.allPokemons };
    
        default:
            return state;
    }
}