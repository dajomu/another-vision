import { PlaneGeometry, Color, Mesh, MeshPhongMaterial } from 'three';

export class Screen extends Mesh {
  constructor(width: number, height: number, color: Color) {
    super();
    this.geometry = new PlaneGeometry(width, height, 10);
    this.material = new MeshPhongMaterial({ color });
  }
}
