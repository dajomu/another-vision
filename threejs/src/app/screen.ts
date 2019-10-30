import { PlaneGeometry, Color, Mesh, MeshBasicMaterial } from 'three';

export class Screen extends Mesh {
  constructor(size: number, color: Color) {
    super();
    this.geometry = new PlaneGeometry(size, size, size);
    this.material = new MeshBasicMaterial({ color });
  }
}