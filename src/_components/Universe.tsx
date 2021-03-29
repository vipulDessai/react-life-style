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
                <div id="time"></div>
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

async function animateCanvas(canvas: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true});

    const fov = 25;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 20, 50);

    const controls = new OrbitControls(camera, canvas);
    // similar to camera.lookAt
    controls.target.set(0, 5, 10);
    controls.update();

    const scene = new THREE.Scene();

    // show plane
    if(false) {
        const planeSize = 40;
    
        const loader = new THREE.TextureLoader();
        const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);
    
        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
          map: texture,
          side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);
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

    window.onresize = (e: any): void => {
        const window = e.currentTarget;
    };

    const planetOrbitNurbPath = [
        [-4.500123, 0.257827, 1.548634],
        [-2.561522, 0.257827, 1.548634],
        [-0.622921, 0.257827, 1.548634],
        [1.315679, 0.257827, 1.548634],
        [3.254279, 0.257827, 1.548634],
        [4.869118, 0.676552, -1.479771],
        [3.724624, 1.009384, -3.886966],
        [0.980967, 1.075951, -4.368408],
        [-3.158036, 0.906314, -3.141517],
    ];

    const galaxies: GalaxyType[] = [
        {
            id: 0,
            planets: [
                {
                    id: 0,
                    creatures: [],
                },
                {
                    id: 1,
                    creatures: [],
                },
                {
                    id: 2,
                    creatures: [],
                },
            ]
        },
        {
            id: 1,
            planets: [
                {
                    id: 0,
                    creatures: [],
                },
                {
                    id: 1,
                    creatures: [],
                },
                {
                    id: 2,
                    creatures: [],
                },
            ]
        },
        {
            id: 2,
            planets: [
                {
                    id: 0,
                    creatures: [],
                },
                {
                    id: 1,
                    creatures: [],
                },
                {
                    id: 2,
                    creatures: [],
                },
            ]
        }
    ];
    const renderedGalaxies: {planetOrbitalPath: ReturnType<typeof makeCurveObject>, planetsObject: THREE.Object3D[]}[] = [];
    for (let i = 0; i < galaxies.length; ++i) {
        const galaxy = galaxies[i];
        const planets = galaxy.planets;
        let position = {
            x: (i * 10) - 10,
            y: 0,
            z: (i * 10) - 10,
        };

        const planetsObject: THREE.Object3D[] = [];
        for (let j = 0; j < planets.length; ++j) {
            const planetScene: any = await loadPlanet();
            const planet = new THREE.Object3D();
            planet.add(planetScene.getObjectByName('Cube'));
            scene.add(planet);
            planetsObject.push(planet);
        }

        const planetOrbitalPath = makeCurveObject(planetOrbitNurbPath, true);
        planetOrbitalPath.curveObject.position.set(position.x, position.y, position.z);
        scene.add(planetOrbitalPath.curveObject);

        const box = new THREE.Box3().setFromObject(planetOrbitalPath.curveObject);
        const boxCenter = box.getCenter(new THREE.Vector3());

        // set the camera to frame the box
        camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);

        controls.target.copy(boxCenter);
        controls.update();
        
        renderedGalaxies.push({ planetOrbitalPath, planetsObject });
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

    // create 2 Vector3s we can use for path calculations
    const planetPosition = new THREE.Vector3();
    const planetTarget = new THREE.Vector3();

    const render = function (time: number) {
        time *= 0.0001;  // convert to seconds

        if(resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        const pathTime = time;
        const targetOffset = 0.01;
        for (let i = 0; i < renderedGalaxies.length; ++i) {
            const galaxy = renderedGalaxies[i];
            const planets = galaxy.planetsObject;
            const planetOrbitalPath = galaxy.planetOrbitalPath;

            for (let j = 0; j < planets.length; ++j) {
                const planet = planets[j];
                // a number between 0 and 1 to evenly space the cars
                const u = pathTime + j / planets.length;

                // get the first point
                planetOrbitalPath.curve.getPointAt(u % 1, planetPosition);
                planetPosition.applyMatrix4(planetOrbitalPath.curveObject.matrixWorld);

                // get a second point slightly further down the curve
                planetOrbitalPath.curve.getPointAt((u + targetOffset) % 1, planetTarget);
                planetTarget.applyMatrix4(planetOrbitalPath.curveObject.matrixWorld);

                // put the planet at the first point (temporarily)
                planet.position.copy(planetPosition);
                // point the planet the second point
                planet.lookAt(planetTarget);

                // put the planet between the 2 points
                planet.position.lerpVectors(planetPosition, planetTarget, 0.5);
            }
        }

        document.getElementById('time').innerText = time.toString();

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    };
    
    requestAnimationFrame(render);
}

async function loadPlanet() {
    const loader = new GLTFLoader();
    const scene = await new Promise(
        (resolve, reject) => {
            loader.load(
                // '/assets/3d/cube-color-uv.gltf',
                '/assets/3d/cube-color-uv.glb',
                // '/assets/3d/city/city.gltf',
                // '/assets/3d/planet-dummy-3x-origin.glb',
                (gltf) => {
                    resolve(gltf.scene);
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );

        }
    );

    return scene;
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

// make curve object from .obj curve array
function makeCurveObject (nurbPath: number[][], showCurve: boolean) {
    const curve = new THREE.CatmullRomCurve3(
        simpleCurvePath(nurbPath),
        true,
    );

    const points = curve.getPoints(250);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const curveObject = new THREE.Line(geometry, material);

    // settings to show the curve object
    if(showCurve) {
        material.depthTest = false;
        curveObject.renderOrder = 1;
    }

    return { curve, curveObject };
}
function sharpenCurvePath(nurbPath: number[][]) {
    return nurbPath.map(
        (p, ndx) => {
            const p0 = new THREE.Vector3(p[0], p[1], p[2]);

            const p1DimensionSet = nurbPath[(ndx + 1) % nurbPath.length];
            const p1 = new THREE.Vector3(p1DimensionSet[0], p1DimensionSet[1], p1DimensionSet[2]);

            return [
                (new THREE.Vector3()).copy(p0),
                (new THREE.Vector3()).lerpVectors(p0, p1, 0.5),
                (new THREE.Vector3()).lerpVectors(p0, p1, 0.5),
            ];
        }
    ).flat();
}
function simpleCurvePath(nurbPath: number[][]) {
    return nurbPath.map(
        p => new THREE.Vector3(p[0], p[1], p[2])
    )
}

// create a cube with only edges or lines
function createEdgeBox(boxVector: THREE.Box3) {
    const dimensions = new THREE.Vector3().subVectors( boxVector.max, boxVector.min );
    const boxGeo = new THREE.BoxBufferGeometry(dimensions.x, dimensions.y, dimensions.z);
    const matrix = new THREE.Matrix4().setPosition(dimensions.addVectors(boxVector.min, boxVector.max).multiplyScalar( 0.5 ));
    boxGeo.applyMatrix4(matrix);
    const edgeGeo = new THREE.EdgesGeometry(boxGeo);
    return new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial( { color: 0xffffff } ));
}