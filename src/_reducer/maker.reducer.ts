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
            const galaxy: GalaxyType = {
                id: getMaxId(galaxies) + 1,
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
            const galaxies = state.galaxies;
            const galaxy = getGalaxy(action, galaxies);
            const planets = [...galaxy.planets];
            const planet: PlanetType = {
                id: getMaxId(planets) + 1,
                creatures: [],
            };
            planets.push(planet);
            galaxy.planets = planets;

            return { ...state, galaxies };
        }

        case GalaxyActions.DELETE_PLANET: {
            const galaxies = state.galaxies;
            const galaxy = getGalaxy(action, galaxies);
            const planets = galaxy.planets;
            // select all the planets NOT equal to action.data.planetId
            galaxy.planets = planets.filter(planet => planet.id !== action.data.planetId); 

            return { ...state, galaxies };
        }

        case PlanetActions.CREATE_POKEMON: {
            const galaxies = state.galaxies;
            const galaxy = getGalaxy(action, galaxies);
            const planets = galaxy.planets;
            const planet = getPlanet(action, planets);

            const allCreatures = state.allCreatures;
            const addedCreaturesList = [...planet.creatures];

            // create a random index to select a random creature
            const randomIndex = Math.floor(Math.random() * allCreatures.length);
            const creature = allCreatures[randomIndex];
            creature.id = getMaxId(addedCreaturesList) + 1;
            addedCreaturesList.push(creature);

            // add changes to galaxies.planets.creatures
            planet.creatures = addedCreaturesList;

            return { ...state, galaxies };
        }

        case PlanetActions.UPGRADE_POKEMON: {
            const galaxies = state.galaxies;
            const galaxy = getGalaxy(action, galaxies);
            const planets = galaxy.planets;
            const planet = getPlanet(action, planets);
            const currentCreaturesList = [...planet.creatures];
            currentCreaturesList.forEach(
                pokemon => {
                    if(pokemon.id === action.data.creatureId)
                        ++pokemon.level;
                }
            );

            // add changes to galaxies.planets.creatures
            planet.creatures = currentCreaturesList;

            return { ...state, galaxies };
        }

        case PlanetActions.KILL_POKEMON: {
            const galaxies = state.galaxies;
            const galaxy = getGalaxy(action, galaxies);
            const planets = galaxy.planets;
            const planet = getPlanet(action, planets);
            const currentCreaturesList = planet.creatures.filter(
                pokemon => {
                    return pokemon.id !== action.data.creatureId;
                }
            );

            // add changes to galaxies.planets.creatures
            planet.creatures = currentCreaturesList;

            return { ...state, galaxies };
        }
    
        default:
            return state;
    }
}

function getGalaxy(action: ActionType, galaxies: GalaxyType[]) {
    return galaxies.filter(galaxy => galaxy.id === action.data.galaxyId)[0];
}

function getPlanet(action: ActionType, planets: PlanetType[]) {
    return planets.filter(planet => planet.id === action.data.planetId)[0];
}

function getMaxId(array: GalaxyType[] | PlanetType[] | PokemonType[]) {
    let maxId = -1;
    for (let index = 0; index < array.length; ++index) {
        const element = array[index];
        
        if (element.id > maxId) 
            maxId = element.id;
    }

    return maxId;
}