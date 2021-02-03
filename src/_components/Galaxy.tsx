import { GalaxyType, PlanetType } from '@/_types';
import React, { Component } from 'react';
import { Planet } from './Planet';

interface PropsType {
    galaxy: GalaxyType,
    destroyGalaxy: (galaxyId: number) => void;
}

interface StateTypes {
    id: number,
    darkStoneQty: number,
    planets: PlanetType[]
}

export class Galaxy extends Component<PropsType, StateTypes> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            id: props.galaxy.id,
            darkStoneQty: props.galaxy.darkStoneQty,
            planets: []
        };
    }

    static getDerivedStateFromProps(props: PropsType, state: StateTypes) {
        console.log('get the derived state from props');

        return {darkStoneQty: 1};
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateTypes) {
        console.log(`galaxy updated!! - stone QTY is ${prevState.darkStoneQty}`);
    }

    render() {
        return (
            <li>
                <ul>
                    <li>Galaxy - {this.state.id} has {this.state.darkStoneQty} stones</li>
                    {
                        this.state.planets.map(
                            planet => <Planet></Planet>
                        )
                    }
                </ul>
            </li>
        );
    }
}