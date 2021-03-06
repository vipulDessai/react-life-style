import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Galaxy } from '@/_components';
import { Messages } from '@/_components/Messages';
import { GalaxyType, DarkStoneType, PokemonType, MessagesActions, DarkStoneActions, UniverseActions } from '@/_types';
import { RootState } from '@/_reducer';
import { MultiverseContext } from '@/_context';
import axios from 'axios';

interface PropsType {
    message?: string,
    darkStone?: DarkStoneType,
    galaxies: GalaxyType[],
    dispatch?: any
}

interface StateType {
    galaxies: GalaxyType[],
}

interface SnapShotType {
    message: string,
}

let timerPointer: NodeJS.Timer = null;

export class UniverseComponent extends Component<PropsType, StateType> {
    static context = MultiverseContext;

    constructor(props: PropsType) {
        super(props);
        this.getAllPokemon();
    }

    canvas: HTMLCanvasElement;
    componentDidMount() {
        animateCanvas(this.canvas);
    }

    getAllPokemon = async () => {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon/?limit=10');
        if(response.status == 200) {
            const allCreatures = response.data.results
                .map(
                    (pokemon: PokemonType) => {
                        pokemon.level = 0;
                        return pokemon;
                    }
                );

            this.dispatcher(UniverseActions.INIT_CREATURES, { allCreatures } );
        }
        else {
            console.log(response);
        }
    }

    GalaxyComponent = Galaxy();

    getSnapshotBeforeUpdate(prevProps: PropsType, prevStates: StateType) {
        console.log('Universe is about to be Updated!!');

        return { message: 'this is a snap before update' };
    }

    componentDidUpdate(prevProps: PropsType, prevStates: StateType, snapshot: SnapShotType) {
        snapshot && console.log(`snapshot message - ${snapshot.message}`);
        
        console.log('Universe Updated!!');
        
        if(this.props.message.length > 0) {
            clearTimeout(timerPointer);
            timerPointer = setTimeout(() => {
                this.dispatcher(MessagesActions.DELETE_MESSAGE);
            }, 5000);
        }
    }

    createGalaxy = () => {
        const darknessReady = this.selector('darkStone');

        // if dark stone is available, consume it and create Galaxy
        if(darknessReady) {
            this.dispatcher(UniverseActions.CREATE_GALAXY);
            this.dispatcher(DarkStoneActions.CONSUME_DARKSTONE);
            this.dispatcher(MessagesActions.ADD_MESSAGE, 'Darkness consumed!!');
        }
        else {
            this.dispatcher(MessagesActions.ADD_MESSAGE, 'Not enough darkness!!');
        }
    }
    destroyGalaxy = (galaxyId: number) => {
        this.dispatcher(UniverseActions.DELETE_GALAXY, { galaxyId });
        this.dispatcher(MessagesActions.ADD_MESSAGE, 'Galaxy destroyed!!');
    }
    createDarkness = () => {
        let darknessReady = this.selector('darkStone');
        if(!darknessReady) {
            this.dispatcher(DarkStoneActions.CREATE_DARKSTONE);
            this.dispatcher(MessagesActions.ADD_MESSAGE, 'Darkness is spreading!!');
        }
        else {
            this.dispatcher(MessagesActions.ADD_MESSAGE, 'Please comsume the existing darkness!!');
        }
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
        // console.log('universe rendered!!');
        const { galaxies, message } = this.props;
        return (
            <section>
                {
                    message && message.length > 0 && <Messages messageText={message}></Messages>
                }
                <ul>
                    <li><button onClick={this.createGalaxy}>Create Galaxy</button></li>
                    <li><button onClick={this.createDarkness}>Create Darkness</button></li>
                </ul>
                <ul>
                {
                    galaxies.map(galaxy => <this.GalaxyComponent key={galaxy.id} galaxy={galaxy} destroyGalaxy={this.destroyGalaxy} />)
                }
                </ul>
                <canvas className="canvas" ref={ref => this.canvas = ref}></canvas>
            </section>
        );
    }
}

export const Universe = () => {
    if(window.location.href.indexOf('reducer') > -1) {
        const mapStateToProps = (state: RootState) => {
            return { 
                message: state.Messages.message,
                darkStone: state.Universe.darkStone,
                galaxies: state.Universe.galaxies,
            };
        };
        const mapDispatchToProps = (dispatch: any) => {
            return { dispatch };
        };
        
        return connect(mapStateToProps, mapDispatchToProps)(UniverseComponent);
    }
    else {
        return UniverseComponent;
    }
};

function animateCanvas(canvas: any) {
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true});

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);
    
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();

    {
        const planeSize = 40;

        const loader = new THREE.TextureLoader();
        const texture = loader.load('/assets/3d/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);

        const planeGoe = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });

        const mesh = new THREE.Mesh(planeGoe, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        // scene.add(mesh);
    }

    {
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        scene.add(light);
        scene.add(light.target);
    }

    // fucntion for city
    function frameArea(sizeToFitOnScreen: any, boxSize: any, boxCenter: any, camera: any) {
        const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
        const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
        const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
        // compute a unit vector that points in the direction the camera is now
        // in the xz plane from the center of the box
        const direction = (new THREE.Vector3())
            .subVectors(camera.position, boxCenter)
            .multiply(new THREE.Vector3(1, 0, 1))
            .normalize();
    
        // move the camera to a position distance units way from the center
        // in whatever direction the camera was from the center already
        camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
    
        // pick some near and far values for the frustum that
        // will contain the box.
        camera.near = boxSize / 100;
        camera.far = boxSize * 100;
    
        camera.updateProjectionMatrix();
    
        // point the camera to look at the center of the box
        camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
    }

    {
        const loader = new GLTFLoader();
        loader.load(
            // '/assets/3d/cube-color-uv.gltf',
            '/assets/3d/cube-color-uv.glb',
            // '/assets/3d/city/city.gltf',
            (gltf) => {
                var root = gltf.scene;
                scene.add(root);

                const box = new THREE.Box3().setFromObject(root);

                const boxSize = box.getSize(new THREE.Vector3()).length();
                const boxCenter = box.getCenter(new THREE.Vector3());

                // frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

                controls.maxDistance = boxSize * 10;
                controls.target.copy(boxCenter);
                controls.update();
            },
            undefined,
            (error) => {
                console.log(error);
            }
        );
    }

    function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
    }

    const render = function () {
        if(resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);
}