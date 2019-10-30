import { PlaneGeometry, Color, Mesh, MeshBasicMaterial } from 'three';

export class Screen extends Mesh {
  constructor(width: number, height: number, color: Color) {
    super();
    this.geometry = new PlaneGeometry(width, height, 10);
    this.material = new MeshBasicMaterial({ color });
  }
}
