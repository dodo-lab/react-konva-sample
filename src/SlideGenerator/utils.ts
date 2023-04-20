import {Node} from 'konva/lib/Node'

export function filterThreshold(this: Node, imageData: ImageData) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // ガンマ補正した上で二値化.
    const gray = (0.2126 * r + 0.7152 * g + 0.0722 * b) * (a / 255);
    data[i] = data[i + 1] = data[i + 2] = gray > 230 ? 255 : 0;
    data[i + 3] = a < 50 ? 0 : 255;
  }
}
