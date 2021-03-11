import React, { Component } from 'react';

import { Galaxy } from '@/_components';
import { Messages } from '@/_components/Messages';
import { GalaxyType, MessagesActionType } from '@/_types';
import { connect } from 'react-redux';
import { RootState } from '@/_reducer';


interface PropsType {
    messages?: string[],
    messageDispatcher?: any
}

interface StateType {
    darknessReady: boolean,
    galaxies: GalaxyType[],
}

interface SnapShotType {
    message: string,
}

let timerPointer: NodeJS.Timer = null;

export class UniverseComponent extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            darknessReady: true,
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
        
        if(this.props.messages.length > 0) {
            clearTimeout(timerPointer);
            timerPointer = setTimeout(() => {
                this.props.messageDispatcher({type: MessagesActionType.DELETE});
            }, 5000);
        }
    }

    createGalaxy = () => {
        const galaxies = [...this.state.galaxies];
        let darknessReady = this.state.darknessReady;

        // if dark stone is available, consume it
        if(darknessReady) {
            galaxies.push({
                id: galaxies.length + 1,
                darkStoneQty: 0,
            });

            darknessReady = false;
            this.props.messageDispatcher({type: MessagesActionType.ADD, messageText: 'Darkness consumed!!'});
        }
        else {
            this.props.messageDispatcher({type: MessagesActionType.ADD, messageText: 'Not enough darkness!!'});
        }

        this.setState({ darknessReady, galaxies });
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
        let darknessReady = this.state.darknessReady;
        if(!darknessReady) {
            darknessReady = true;
            this.props.messageDispatcher({type: MessagesActionType.ADD, messageText: 'Darkness is spreading!!'});
        }
        else {
            this.props.messageDispatcher({type: MessagesActionType.ADD, messageText: 'Please comsume the existing darkness!!'});
        }

        this.setState({ darknessReady });
    }

    render() {
        // console.log('universe rendered!!');
        return (
            <section>
                {
                    this.props.messages && this.props.messages.length > 0 && <Messages messages={this.props.messages}></Messages>
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



let unifiedUniverse;
if(window.location.href.indexOf('reducer') > -1) {
    const mapStateToProps = (state: RootState) => {
        return { messages: state.Messages.messages };
    };
    const mapDispatchToProps = (dispatch: any) => {
        return { messageDispatcher: dispatch };
    };
    
    unifiedUniverse = connect(mapStateToProps, mapDispatchToProps)(UniverseComponent);
}
else {
    unifiedUniverse = UniverseComponent;
}

export const Universe = unifiedUniverse;