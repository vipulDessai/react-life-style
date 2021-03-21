import { PokemonType } from './pokemon';

export interface PlanetType {
    id: number,
    creatures: PokemonType[],
}