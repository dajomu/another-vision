import { SphereGeometry, DoubleSide, Color, Mesh, MeshPhongMaterial } from 'three';

export class Room extends Mesh {
  constructor(size: number, color: Color) {
    super();
    this.geometry = new SphereGeometry(size, size, size);
    this.material = new MeshPhongMaterial({ color, side: DoubleSide });
  }
}
