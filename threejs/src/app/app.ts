import { AxesHelper, Color, BoxGeometry, DoubleSide, Fog, Mesh, MeshBasicMaterial, MeshPhongMaterial, PCFSoftShadowMap, PCFShadowMap, BasicShadowMap, PerspectiveCamera, PointLight, Scene, SpotLight, Vector3, WebGLRenderer, FogExp2 } from 'three';
// import { Room } from './room';
// import { Screen } from './screen';
import { getSixRandomThreeColours } from './colourUtils';
import { WEBVR } from 'three/examples/jsm/vr/WebVR.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
// const TWEEN = require('@tweenjs/tween.js');
import TWEEN from '@tweenjs/tween.js'

const loader = new OBJLoader();

export class App {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(90, innerWidth / innerHeight, 0.1, 10);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });
  private tweenBackColour?: TWEEN.Tween;
  currentColourIndex = 0;

  private animationColors: Color[] = getSixRandomThreeColours();

  // Currently not using as using room model
  // private screen: Screen;
  // private room: Room;

  constructor() {
    // IMPORTANT - vr viewer starts off looking in (0, 0, -1) direction

    // Screen - currently not using as using room model
    // this.screen = new Screen(10, 5, new Color('white'));
    // this.scene.add(this.screen);
    // this.screen.position.set(0,0,-10);

    // Room - currently not using as using room model
    // this.room = new Room(20, new Color('red'));
    // this.scene.add(this.room);
    // this.room.position.set(0,0,0);

    // Light
    const backColor = this.animationColors[0].getHex();
    const frontColor = this.animationColors[1].getHex();
    const intensity = 1;
    const backLight = new SpotLight('white', intensity, 100);
    backLight.color.set(this.animationColors[0]);
    backLight.castShadow = true;
    backLight.position.set(0, 0, 1);
    // this.scene.add( new Mesh( new BoxGeometry( 0.5,0.5,0.5 ), new MeshBasicMaterial() ) );
    backLight.target.position.set(0, 0, -1);

    // Make shadow edges tighter/less diffracty
    backLight.shadow.mapSize.width = 4000;  // default
    backLight.shadow.mapSize.height = 4000; // default

    this.scene.add(backLight);
    this.scene.add(backLight.target);

    const frontLight = new SpotLight(frontColor, intensity);
    frontLight.castShadow = false;
    frontLight.position.set(0, 0, 0);
    // this.scene.add( new Mesh( new BoxGeometry( 0.5,0.5,0.5 ), new MeshBasicMaterial() ) );
    frontLight.target.position.set(0, 0, -1);

    this.scene.add(frontLight);
    this.scene.add(frontLight.target);

    const lightBlock = new Mesh( new BoxGeometry( 0.1, 3.24, 0.15 ), new MeshPhongMaterial() );
    lightBlock.position.set(0, 0, 0);
    lightBlock.castShadow = true; //default is false
    // lightBlock.scale.set(0.00456, 1.5, 3);
    // add the object to the scene
    this.scene.add( lightBlock );

    // Fog
    //this.scene.fog = new Fog(0x326ba8, 1, 3)
    this.scene.fog = new FogExp2('white', 0.3)

    // To see XYZ axes in VR
    var axesHelper = new AxesHelper( 20 );
    axesHelper.position.set(0, 0, 0);
    this.scene.add( axesHelper );

    // Camera initialisation
    this.camera.position.set(0,0,0);
    this.camera.lookAt(new Vector3(1, 1, 1));

    this.initVRorControls();

    this.loadRoom(this);

    this.renderer.setAnimationLoop(this.render);
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(0,0,0)'));
    this.renderer.shadowMap.enabled = true;

    // TODO: PCFSoftShadowMap causes performance issues (PCFShadowMap doesn't).
    // Investigate different light shadow mapping variables (https://threejs.org/docs/#api/en/lights/SpotLight);
    // different light types etc.
    this.renderer.shadowMap.type = PCFShadowMap;

    this.addColourTween(backLight.color, 0);
    this.addColourTween(frontLight.color, 1);
  }

  addColourTween(color: Color, offset: number) {
    if (this.currentColourIndex < 5) {
      this.currentColourIndex += 1;
    } else {
      this.currentColourIndex = 0;
    }
    this.tweenBackColour = new TWEEN.Tween(color)
      .to(this.animationColors[this.currentColourIndex + offset], 4000)
      .onComplete(() => {
        this.addColourTween(color, offset);
      })
      .start();
  }

  private initVRorControls = () => {
    // const params = (new URL(window.location.href)).searchParams;
    // const allowvr = params.get('allowvr') === 'true';
    const allowvr = false;
    if (allowvr) {
      // Add VR button
      document.body.appendChild( WEBVR.createButton( this.renderer, {referenceSpaceType: 'false'} ) );
      this.renderer.vr.enabled = true;
    } else {
      // no VR, add some controls
      const controls = new OrbitControls(this.camera, document.getElementById('main-canvas') as HTMLCanvasElement);
      controls.target.set(0, 0, -2);
      controls.update();
    }
  }

  // Use room model
  private loadRoom = (that: any) => {
    loader.load(
      // resource URL
      './dist/assets/room1.obj',
      // called when resource is loaded

      function( obj ){
        // apply material to object so that light reflects off it
        obj.traverse( function( child ) {
            if ( child instanceof Mesh ) {
                child.material = new MeshPhongMaterial({ color: new Color('white'), side: DoubleSide });
                child.receiveShadow = true;
            }
        } );
        // need to figure out a good co-ordinate system to place camera, lights and room object
        obj.position.set(-0.08, 0, -2);
        obj.rotation.set(0, -Math.PI / 2, 0);
        that.scene.add( obj );
      },

      // called when loading is in progresses
      function ( xhr: any ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      // called when loading has errors
      ( error: any ) => {
        console.log( 'An error happened' );
      }
    );
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render = () => {
    // console.log('render:',
    //   'X-pos: ' + this.camera.position.x,
    //   'Y-pos: ' + this.camera.position.y,
    //   'Z-pos: ' + this.camera.position.z,
    //   'X-rot: ' + this.camera.rotation.x,
    //   'Y-rot: ' + this.camera.rotation.y,
    //   'Z-rot: ' + this.camera.rotation.z);
    this.renderer.render(this.scene, this.camera);
    this.adjustCanvasSize();
    TWEEN.update();
  }
}
