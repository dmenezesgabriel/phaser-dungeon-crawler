import Phaser from "phaser";

export default class Game extends Phaser.Scene {
  constructor() {
    super("game");
  }

  preload() {}

  create() {
    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles");

    const groundLayer = map.createLayer("Ground", tileset);
    const wallsLayer = map.createLayer("Walls", tileset);

    wallsLayer.setCollisionByProperty({ colides: true });

    const debugGraphics = this.add.graphics().setAlpha(0.7);
    wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });

    const faune = this.add.sprite(128, 128, "faune", "walk-down-3.png");
  }
}
