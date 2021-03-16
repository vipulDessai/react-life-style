export interface PokemonType {
    id: number,
    name: string,
    level: number,
    url: string,
}

export enum PokemonAction {
    INIT = 'POKEMON_INIT',
}