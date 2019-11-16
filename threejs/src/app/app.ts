import { AxesHelper, Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { Room } from './room';
import { Screen } from './screen';
import { WEBVR } from 'three/examples/jsm/vr/WebVR.js';
import THREE = require('three');

export class App {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(90, innerWidth / innerHeight, 0.1, 10000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });

  private screen: Screen;
  private room: Room;

  constructor() {
    // IMPORTANT - vr viewer starts off looking in (0, 0, -1) direction

    // Screen
    this.screen = new Screen(10, 5, new Color('white'));
    this.scene.add(this.screen);
    this.screen.position.set(0,0,-10);

    // Room
    this.room = new Room(20, new Color('red'));
    this.scene.add(this.room);
    this.room.position.set(0,0,0);

    // Light
    const color = 0x35fc03;
    const intensity = 0.75;
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(0, 0, 100);
    light.target.position.set(0, 0, -1);

    this.scene.add(light);
    this.scene.add(light.target);

    // To see XYZ axes in VR
    var axesHelper = new AxesHelper( 20 );
    axesHelper.position.set(0, 0, 0);
    this.scene.add( axesHelper );

    // Camera initialisation
    this.camera.position.set(0,0,0);
    this.camera.lookAt(new Vector3(1, 1, 1));
    
    // Add VR button
    document.body.appendChild( WEBVR.createButton( this.renderer, {referenceSpaceType: 'false'} ) );
    this.renderer.vr.enabled = true;

    this.renderer.setAnimationLoop(this.render);
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(0,0,0)'));
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  private render = () => {
    console.log('render:', 
      'X-pos: ' + this.camera.position.x,
      'Y-pos: ' + this.camera.position.y, 
      'Z-pos: ' + this.camera.position.z, 
      'X-rot: ' + this.camera.rotation.x, 
      'Y-rot: ' + this.camera.rotation.y, 
      'Z-rot: ' + this.camera.rotation.z);
    this.renderer.render(this.scene, this.camera);
    this.adjustCanvasSize();
  }
}
