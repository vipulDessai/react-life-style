import { MultiverseContext } from '@/_context';
import { RootState } from '@/_reducer';
import { DarkStoneActions, DarkStoneType, GalaxyActions, GalaxyType, MessagesActions, PlanetType } from '@/_types';
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

class GalaxyComponent extends Component<PropsType> {
    static context = MultiverseContext;

    PlanetComponent = Planet();

    shouldComponentUpdate(nextProps: PropsType, nextState: StateType):boolean {
        // as of now allow update irrespectively
        return true;
    }

    componentDidUpdate(prevProps: PropsType, prevState: StateType) {
        
    }

    createPlanet = (galaxyId: number) => {
        const darknessReady = this.selector('darkStone');
        if(darknessReady) {
            const data = { galaxyId };
            this.dispatcher(GalaxyActions.CREATE_PLANET, data);
            this.dispatcher(DarkStoneActions.CONSUME_DARKSTONE);
            this.dispatcher(MessagesActions.ADD_MESSAGE, 'Planet spawned!!');
        }
        else {
            this.dispatcher(MessagesActions.ADD_MESSAGE, 'Not enough darkness!!');
        }
    }
    deletePlanet = (galaxyId: number, planetId: number) => {
        const data = { galaxyId, planetId };
        this.dispatcher(GalaxyActions.DELETE_PLANET, data);
        this.dispatcher(DarkStoneActions.CREATE_DARKSTONE);
        this.dispatcher(MessagesActions.ADD_MESSAGE, 'Planet destroyed!!');
    }

    selector = (stateName: string) => {
        return this.props.darkStone.ready;
    }
    dispatcher = (type: string, data?: any) => {
        // context
        // TODO: check if context is available properly
        if(this.context.foo) {
            
        }
        // reducer
        else {
            this.props.dispatch({type, data});
        }
    }

    render() {
        const { galaxy, destroyGalaxy } = this.props;
        const { planets } = galaxy;
        return (
            <li>
                <ul>
                    <li>Galaxy - {galaxy.id} <button onClick={() => this.createPlanet(galaxy.id)}>Create Planet</button><button onClick={() => destroyGalaxy(galaxy.id)}>x</button></li>
                    {
                        planets.length > 0 &&
                            <li>
                                <ul>
                                    {
                                        planets.map(
                                            planet => <this.PlanetComponent key={planet.id} galaxy={galaxy} planet={planet} deletePlanet={this.deletePlanet} />
                                        )
                                    }
                                </ul>
                            </li>
                    }
                </ul>
            </li>
        );
    }
}

export const Galaxy = () => {
    if(window.location.href.indexOf('reducer') > -1) {
        const mapStateToProps = (state: RootState) => {
            return {
                darkStone: state.Universe.darkStone,
            };
        };
        const mapDispatchToProps = (dispatch: any) => {
            return { dispatch };
        };
    
        return connect(mapStateToProps, mapDispatchToProps)(GalaxyComponent);
    }
    else {
        return GalaxyComponent;
    }
};