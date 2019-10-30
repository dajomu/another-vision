import { BoxGeometry, DoubleSide, Color, Mesh, MeshBasicMaterial } from 'three';

export class Room extends Mesh {
  constructor(size: number, color: Color) {
    super();
    this.geometry = new BoxGeometry(size, size, size);
    this.material = new MeshBasicMaterial({ color, side: DoubleSide });
  }
}
