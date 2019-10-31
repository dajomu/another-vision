import { FogExp2, Color } from 'three';

export class Haze extends FogExp2 {
  constructor(color: Color, density: number) {
    super(0xefd1b5, 0.0025);
    this.color = new Color();
  }
}
