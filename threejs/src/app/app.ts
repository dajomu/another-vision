import { AxesHelper, Color, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { Brick } from './brick';
import { Screen } from './screen';
import { WEBVR } from 'three/examples/jsm/vr/WebVR.js';

export class App {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 10000);
  private readonly renderer = new WebGLRenderer({
    antialias: true,
    canvas: document.getElementById('main-canvas') as HTMLCanvasElement,
  });

  // private brick: Brick;
  // private bricks: Brick[];

  private screen: Screen;

  constructor() {
    // IMPORTANT - vr viewer starts off looking in (0, 0, -1) direction

    this.screen = new Screen(10, 5, new Color('white'));
    this.scene.add(this.screen);
    this.screen.position.set(0,0,-10);


    // this.brick = new Brick(5, new Color('rgb(255,0,0)'));
    // this.scene.add(this.brick);
    // this.brick.position.set(0,0,-10);
    // this.bricks = [];

    // for(let x = 0; x < 10; x++) {
    //   for(let y = 0; y < 10; y++) {
    //     for(let z = 0; z < 10; z++) {
    //       const bricky = new Brick(1, new Color(`rgb(${x*25},${y*25},${z*25})`));
    //       console.log('added brick:', (x*10) -50,(y*10) -50,(z*10) -50)
    //       bricky.position.set((x*10) -50,(y*10) -50,(z*10) -50);
    //       this.bricks.push(bricky);
    //     }
    //   }
    // }
    // this.bricks.forEach(brickk => {this.scene.add(brickk);})
    // this.scene.add(this.bricks);

    var axesHelper = new AxesHelper( 20 );
    axesHelper.position.set(0, 0, 0);
    this.scene.add( axesHelper );

    this.camera.position.set(0,0,0);
    this.camera.lookAt(new Vector3(1, 1, 1));

    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(new Color('rgb(0,0,0)'));

    document.body.appendChild( WEBVR.createButton( this.renderer, {referenceSpaceType: 'false'} ) );
    this.renderer.vr.enabled = true;

    // this.render();
    this.renderer.setAnimationLoop(this.erkkiTestRender);
    // this.camera.lookAt(new Vector3(1, 1, 1));
  }

  private adjustCanvasSize() {
    this.renderer.setSize(innerWidth, innerHeight);
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  // private render() {
  //   this.renderer.render(this.scene, this.camera);
  //   requestAnimationFrame(() => this.render());

  //   this.adjustCanvasSize();
  //   this.brick.rotateY(0.03);
  // }

  private erkkiTestRender = () => {
    console.log('render?', this.camera.position.x, this.camera.position.y, this.camera.position.z, this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z);
    this.renderer.render(this.scene, this.camera);
    this.adjustCanvasSize();
    // this.screen.rotateY(0.03);
    // this.camera.position.set(0,0,0);
    // this.camera.lookAt(new Vector3(1, 1, 1));
    // this.brick.rotateY(0.03);
    // this.bricks.forEach(brickk => {brickk.rotateY(0.03)})
  }
}
