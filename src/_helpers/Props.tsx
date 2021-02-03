import React, { Component } from 'react';

import { Galaxy } from '@/_components';
import { Messages } from '@/_components/Messages';
import { GalaxyType } from '@/_types';


interface PropsType {

}

interface StateType {
    darknessReady: boolean,
    messages: string[],
    galaxies: GalaxyType[],
}

interface SnapShotType {
    message: string,
}

let timerPointer: NodeJS.Timer = null;

export class PropsComponent extends Component<PropsType, StateType> {
    constructor(props: {}) {
        super(props);
        this.state = {
            darknessReady: true,
            messages: [],
            galaxies: [{
                id: 1,
                darkStoneQty: 0,
            }]
        };
    }

    componentDidMount() {
        console.log('Universe Instantiated!!');
    }

    getSnapshotBeforeUpdate(prevProps: PropsType, prevStates: StateType) {
        console.log('Universe is about to be Updated!!');

        return { message: 'this is a snap before update' };
    }

    componentDidUpdate(prevProps: PropsType, prevStates: StateType, snapshot: SnapShotType) {
        snapshot && console.log(`snapshot message - ${snapshot.message}`);
        
        console.log('Universe Updated!!');
        
        if(this.state.messages.length > 0) {
            clearTimeout(timerPointer);
            timerPointer = setTimeout(() => {
                this.setState({ messages: [] });
            }, 5000);
        }
    }

    createGalaxy = () => {
        const galaxies = [...this.state.galaxies];
        let darknessReady = this.state.darknessReady;
        const messages = [...this.state.messages];

        // if dark stone is available, consume it
        if(darknessReady) {
            galaxies.push({
                id: galaxies.length + 1,
                darkStoneQty: 0,
            });

            darknessReady = false;
            messages.push('Darkness consumed!!');
        }
        else {
            messages.push('Not enough darkness!!');
        }

        this.setState({ darknessReady, messages, galaxies });
    }

    destroyGalaxy = (galaxyId: number) => {
        let galaxies = [...this.state.galaxies];
        galaxies = galaxies.filter(
            galaxy => galaxy.id !== galaxyId
        ).map(
            (galaxy, index) => {
                galaxy.id = index;

                return galaxy;
            }
        );

        this.setState({ galaxies });
    }

    createDarkness = () => {
        const messages = [...this.state.messages];
        let darknessReady = this.state.darknessReady;
        if(!darknessReady) {
            darknessReady = true;
            messages.push('Darkness is spreading!!');
        }
        else {
            messages.push('Please comsume the existing darkness!!');
        }

        this.setState({ darknessReady, messages });
    }

    render() {
        console.log('universe rendered!!');
        return (
            <section>
                {
                    this.state.messages.length > 0 && <Messages messages={this.state.messages}></Messages>
                }
                <ul>
                    <li><button onClick={this.createGalaxy}>Create Galaxy</button></li>
                    <li><button onClick={this.createDarkness}>Create Darkness</button></li>
                </ul>
                <ul>
                    {
                        this.state.galaxies.map(galaxy => <Galaxy key={galaxy.id} galaxy={galaxy} destroyGalaxy={this.destroyGalaxy} />)
                    }
                </ul>
            </section>
        );
    }
}