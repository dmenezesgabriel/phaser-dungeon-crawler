import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.image("tiles", "tiles/0x72_DungeonTilesetII_v1.4.png");
    this.load.tilemapTiledJSON("dungeon", "tiles/dungeon-01.json");
  }

  create() {
    this.scene.start("game");
  }
}
