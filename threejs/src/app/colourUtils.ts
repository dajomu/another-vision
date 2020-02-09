import { Color } from 'three';

function getRandomColor(): string {
  let letters = '0123456789abcdef';
  let randomColor = '';
  for (let i = 0; i < 6; i++) {
    randomColor += letters[Math.floor(Math.random() * 16)];
  }
  return '#' + randomColor;
}

export function getSixRandomThreeColours(): Color[] {
  return [1,2,3,4,5,6].map(() => {const randCol = getRandomColor(); console.log(randCol); return new Color(randCol)});
}
