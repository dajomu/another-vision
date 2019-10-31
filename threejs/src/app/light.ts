import { SpotLight, Color } from 'three';

export class Light extends SpotLight {
  constructor(color: Color) {
    super();
    this.color = new Color();
  }
}
