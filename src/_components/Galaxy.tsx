import { MultiverseContext } from '@/_context';
import { RootState } from '@/_reducer';
import { DarkStoneActionType, DarkStoneType, GalaxyType, MessagesActionType, PlanetType } from '@/_types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Planet } from './Planet';

interface PropsType {
    galaxy: GalaxyType,
    destroyGalaxy: (galaxyId: number) => void;
    darkStone?: DarkStoneType,
    dispatch?: any, 
}

interface StateType {
    id: number,
    planets: PlanetType[]
}

export class GalaxyComponent extends Component<PropsType, StateType> {
    static context = MultiverseContext;

    constructor(props: PropsType) {
        super(props);

        this.state = {
            id: null,
            planets: []
        };
    }

    shouldComponentUpdate(nextProps: PropsType, nextState: StateType):boolean {
        // as of now allow update irrespectively
        return true;
    }

    static getDerivedStateFromProps(props: PropsType, state: StateType) {
        console.log('get the derived state from props');

        return {
            id: props.galaxy.id,
            planets: [{ id: 0 }],
        };
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        console.log(`galaxy updated!! - planet count - ${prevState.planets.length}`);
    }

    createPlanet = () => {
        if(this.context) {
            const { createPlanet } = this.context;
        }
        else {
            if(this.props.darkStone.ready) {
                this.props.dispatch({type: DarkStoneActionType.CONSUME});
            }
            else {
                this.props.dispatch({type: MessagesActionType.ADD, messageText: 'Not enough darkness!!'});
            }
        }
    }

    render() {
        return (
            <li>
                <ul>
                    <li>Galaxy - {this.state.id} <button onClick={this.createPlanet}>Create Planet</button></li>
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

let unifiedGalaxyComponent;
if(window.location.href.indexOf('reducer') > -1) {
    const mapStateToProps = (state: RootState) => {
        return {
            darkStone: state.DarkStone,
        };
    };
    const mapDispatchToProps = (dispatch: any) => {
        return { dispatch };
    };

    unifiedGalaxyComponent = connect(mapStateToProps, mapDispatchToProps)(GalaxyComponent);
}
else {
    unifiedGalaxyComponent = GalaxyComponent;
}

export const Galaxy = unifiedGalaxyComponent;