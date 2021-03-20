import { PlanetType } from './planet';

export interface GalaxyType {
    id: number,
    planets: PlanetType[],
}