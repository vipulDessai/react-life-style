import React, { Component } from 'react';

import { Galaxy } from '@/_components';

interface GalaxyType {
    id: number,
    darkStoneQty: number,
}

interface State {
    galaxies: GalaxyType[],
}

export class Props extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            galaxies: [{
                id: 1,
                darkStoneQty: 0,
            }]
        };
    }

    render() {
        return (
            <ul>
                {
                    this.state.galaxies.map(galaxy => <Galaxy key={galaxy.id} />)
                }
            </ul>
        );
    }
}