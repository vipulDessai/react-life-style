import { PokemonType, GalaxyType, UniverseActions, GalaxyActions, PlanetActions, DarkStoneActions, PlanetType, DarkStoneType } from '@/_types';

interface StateType {
    allCreatures?: PokemonType[],
    galaxies?: GalaxyType[],
    darkStone?: DarkStoneType,
}

interface ActionType {
    type: string,
    data: {
        allCreatures: PokemonType[],
        galaxyId: number,
        planetId: number,
        creatureId: number,
    }
}

const initialState: StateType = {
    darkStone: {
        ready: false,
    },
    allCreatures: [],
    galaxies: []
};

export function Maker(state = initialState, action: ActionType): StateType {
    switch (action.type) {
        case DarkStoneActions.CREATE_DARKSTONE:
            return {
                ...state,
                darkStone: { ready: true }
            };

        case DarkStoneActions.CONSUME_DARKSTONE:
            return { 
                ...state,
                darkStone: { ready: false }
            };

        case UniverseActions.INIT_CREATURES:
            return { ...state, allCreatures: action.data.allCreatures };

        case UniverseActions.CREATE_GALAXY: {
            const galaxies = [...state.galaxies];

            let maxId = -1;
            for (let index = 0; index < galaxies.length; ++index) {
                const element = galaxies[index];
                
                if (element.id > maxId) 
                    maxId = element.id;
            }
            const galaxy: GalaxyType = {
                id: maxId + 1,
                planets: [],
            };
            galaxies.push(galaxy);

            return { ...state, galaxies };
        }
        case UniverseActions.DELETE_GALAXY: {
            let galaxies = [...state.galaxies];
            galaxies = galaxies.filter(
                galaxy => galaxy.id !== action.data.galaxyId
            );
            return { ...state, galaxies };
        }

        case GalaxyActions.CREATE_PLANET: {
            const galaxies = [...state.galaxies];
            let galaxy = galaxies[0];
            for (let index = 0; index < galaxies.length; index++) {
                const element = galaxies[index];
                
                if(element.id === action.data.galaxyId) {
                    galaxy = element;
                }
            }
            const planets = [...galaxy.planets];

            let maxId = -1;
            for (let index = 0; index < planets.length; ++index) {
                const element = planets[index];
                
                if (element.id > maxId) 
                    maxId = element.id;
            }

            const planet: PlanetType = {
                id: maxId + 1,
                creatures: [],
            };

            planets.push(planet);

            galaxy.planets = planets;

            return { ...state, galaxies };
        }

        case GalaxyActions.DELETE_PLANET: {
            const galaxies = [...state.galaxies];
            let galaxy = galaxies[0];
            for (let index = 0; index < galaxies.length; index++) {
                const element = galaxies[index];
                
                if(element.id === action.data.galaxyId) {
                    galaxy = element;
                }
            }
            
            galaxy.planets = galaxy.planets.filter(planet => planet.id !== action.data.planetId); 

            return { ...state, galaxies };
        }

        case PlanetActions.CREATE_POKEMON: {
            const galaxies = [...state.galaxies];
            const allCreatures = state.allCreatures;
            const addedCreaturesList = [...state.allCreatures];
            const randomIndex = Math.floor(Math.random() * allCreatures.length);

            const pokemon = allCreatures[randomIndex];

            // TODO: need to fix this by assigning a proper ID
            pokemon.id = addedCreaturesList.length;

            addedCreaturesList.push(pokemon);

            return { ...state, galaxies };
        }

        case PlanetActions.UPGRADE_POKEMON: {
            const galaxies = [...state.galaxies];
            const currentPokemons = [...this.state.currentPokemons];
        
            currentPokemons.forEach(
                pokemon => {
                    if(pokemon.id === action.data.creatureId)
                        ++pokemon.level;
                }
            );

            return { ...state, galaxies };
        }

        case PlanetActions.KILL_POKEMON: {
            const galaxies = [...state.galaxies];
            let currentPokemons = [...this.state.currentPokemons];

            currentPokemons = currentPokemons.filter(
                pokemon => {
                    return pokemon.id !== action.data.creatureId;
                }
            );

            return { ...state, galaxies };
        }
    
        default:
            return state;
    }
}