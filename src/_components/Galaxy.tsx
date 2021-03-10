import { MultiverseContext } from '@/_helpers';
import { GalaxyType, PlanetType } from '@/_types';
import React, { Component } from 'react';
import { Planet } from './Planet';

interface PropsType {
    galaxy: GalaxyType,
    destroyGalaxy: (galaxyId: number) => void;
}

interface StateType {
    id: number,
    planets: PlanetType[]
}

export class Galaxy extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            id: null,
            planets: []
        };
    }

    shouldComponentUpdate(nextProps: PropsType, nextState: StateType):boolean {
        // as of now allow update
        return true;
    }

    static getDerivedStateFromProps(props: PropsType, state: StateType) {
        console.log('get the derived state from props');

        return {
            id: props.galaxy.id,
            planets: [{ id: 0, food: 0 }],
        };
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        console.log(`galaxy updated!! - planet count - ${prevState.planets.length}`);
    }

    render() {
        return (
            <MultiverseContext.Consumer>
                {
                    context => {
                        const {createEnergy, consumeEnergyCreatePlanet, energy } = context;

                        return (
                            <li>
                                <ul>
                                    <li>Galaxy - {this.state.id} has {energy} energy <button onClick={createEnergy}>Create Energy</button><button onClick={consumeEnergyCreatePlanet}>Create Planet</button></li>
                                    <li>
                                        <ul>
                                            {
                                                this.state.planets.map(
                                                    planet => <Planet key={planet.id} planet={planet}></Planet>
                                                )
                                            }
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        );
                    }
                }
            </MultiverseContext.Consumer>
        );
    }
}