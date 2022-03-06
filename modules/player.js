import Entity from "./entity.js";

export default class Player extends Entity {
  constructor(x, y, radius, color) {
    super(x, y, radius);
    this.color = color;
  }
}
