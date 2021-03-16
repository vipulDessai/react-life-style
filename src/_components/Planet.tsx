import React, { Component } from 'react';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { DarkStoneActionType, DarkStoneType, MessagesActionType, PlanetType, PokemonType } from '@/_types';
import { Pokemon } from './Pokemon';
import { connect } from 'react-redux';
import { RootState } from '@/_reducer';

interface PropsType {
    planet: PlanetType,
    deletePlanet: (id: number) => void,
    pokemons?: PokemonType[],
    dispatch?: any,
    darkStone?: DarkStoneType,
}

interface StateType {
    currentPokemons: PokemonType[],
}

enum PlanetActions {
    CREATE_POKEMON = 'CREATE_POKEMON',
    ADD_MESSAGE = 'ADD_MESSAGE',
}

class PlanetComponent extends Component<PropsType, StateType> {
    constructor(props: PropsType) {
        super(props);

        this.state = {
            currentPokemons: [],
        };
    }
    mount: any;
    componentDidMount() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize( 300, 300 );
        this.mount.appendChild( renderer.domElement );

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshStandardMaterial( { color: 0x7e31eb } );

        const loader = new GLTFLoader();
        loader.load(
            '/assets/3d/cube.glb', 
            (gltf) => {
                
                scene.add(gltf.scene);

                const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
                scene.add( light );

                camera.position.z = 2;
            },
            undefined,
            (error) => {
                console.log(error);
            }
        );

        // const cube = new THREE.Mesh( geometry, material );        
        // scene.add( cube );
        // const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        // scene.add( light );

        // camera.position.z = 2;

        // const animate = function () {
        //     requestAnimationFrame( animate );
        //     cube.rotation.x += 0.01;
        //     cube.rotation.y += 0.01;
        //     cube.rotation.z += 0.01;
        //     renderer.render( scene, camera );
        // };
        // animate();
    }

    createRandomPokemon = () => {
        const darknessReady = this.props.darkStone.ready;
        if(darknessReady) {
            const addPokemonsList = [...this.state.currentPokemons];
            const randomIndex = Math.floor(Math.random() * this.props.pokemons.length);

            const pokemon = this.props.pokemons[randomIndex];

            // TODO: need to fix this by assigning a proper ID
            pokemon.id = addPokemonsList.length;

            addPokemonsList.push(pokemon);

            this.setState({currentPokemons: addPokemonsList});
            this.dispatcher(PlanetActions.CREATE_POKEMON);
            this.dispatcher(PlanetActions.ADD_MESSAGE, 'Pokemon created!!');
        }
        else {
            this.dispatcher(PlanetActions.ADD_MESSAGE, 'Not enough darkness!!');
        }
    }
    upgradePokemon = (id: number) => {
        const currentPokemons = [...this.state.currentPokemons];
        
        currentPokemons.forEach(
            pokemon => {
                if(pokemon.id === id)
                    ++pokemon.level;
            }
        );

        this.setState({currentPokemons});
        this.dispatcher(PlanetActions.ADD_MESSAGE, 'Pokemon updated!!');
    }
    deletePokemon = (id: number) => {
        let currentPokemons = [...this.state.currentPokemons];

        currentPokemons = currentPokemons.filter(
            pokemon => {
                return pokemon.id !== id;
            }
        );

        this.setState({currentPokemons});
        this.dispatcher(PlanetActions.ADD_MESSAGE, 'Pokemon killed!!');
    }

    dispatcher = (type: string, messageText?: string) => {
        let dipatchType = '';
        switch (type) {
            case PlanetActions.CREATE_POKEMON:
                dipatchType = DarkStoneActionType.CONSUME;
                break;
            
            case PlanetActions.ADD_MESSAGE:
                dipatchType = MessagesActionType.ADD;
                break;
        
            default:
                break;
        }

        // context
        // TODO: check if context is available properly
        if(this.context.foo) {
            
        }
        // reducer
        else {
            this.props.dispatch({type: dipatchType, messageText});
        }
    }

    render() {
        const {id} = this.props.planet;
        return (
            <>
                <li>Planet - {id} Pokemons - {this.state.currentPokemons.length} <button onClick={this.createRandomPokemon}>Create Pokemons</button><button onClick={() => this.props.deletePlanet(id)}>x</button></li>
                {
                    this.state.currentPokemons.length > 0 && 
                        <li>
                            <ul>
                                {
                                    this.state.currentPokemons.map(
                                        (pokemon, index) => <Pokemon key={index} deletePokemon={this.deletePokemon} upgradePokemon={this.upgradePokemon} pokemon={pokemon} />
                                    )
                                }
                            </ul>
                        </li>
                }
                <div ref={ref => (this.mount = ref)}></div>
            </>
        );
    }
}

export const Planet = () => {
    if (window.location.href.indexOf('reducer') > -1) {
        const mapStateToProps = (state: RootState) => {
            return { darkStone: state.DarkStone, pokemons: state.Pokemons.all };
        };
        const mapDispatchToProps = (dispatch: any) => {
            return { dispatch };
        };
        return connect(mapStateToProps, mapDispatchToProps)(PlanetComponent);
    }
    else {
        return PlanetComponent;
    }
};