import React, { Component } from 'react';

interface PropsType {
    destroyGalaxy: (galaxyId: number) => void;
}

export class Galaxy extends Component<PropsType> {
    constructor(props: PropsType) {
        super(props);
    }
    render() {
        return (
            <li>Galaxy</li>
        );
    }
}