import Phaser from "phaser";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    // Load Maps
    this.load.image("tiles", "tiles/0x72_DungeonTilesetII_v1.4.png");
    this.load.tilemapTiledJSON("dungeon", "tiles/dungeon-01.json");

    // Load Characters
    this.load.atlas("faune", "characters/faune.png", "characters/faune.json");
    this.load.atlas("lizard", "enemies/lizard.png", "enemies/lizard.json");

    // Load Items
    this.load.atlas("treasure", "items/treasure.png", "items/treasure.json");

    // Load UI
    this.load.image("ui-heart-empty", "ui/ui_heart_empty.png");
    this.load.image("ui-heart-half", "ui/ui_heart_half.png");
    this.load.image("ui-heart-full", "ui/ui_heart_full.png");

    // Load Weapons
    this.load.image("knife", "weapons/weapon_knife.png");
  }

  create() {
    this.scene.start("game");
  }
}
