import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles", 16, 16);

    map.createLayer("Ground", tileset);
    const wallsLayer = map.createLayer("Walls", tileset);

    // Add walls layer colision
    wallsLayer.setCollisionByProperty({ colides: true });

    debugDraw(wallsLayer, this);

    // Add animations
    this.faune = this.physics.add.sprite(128, 128, "faune", "sprites/walk-down/walk-down-3.png");
    // change character size
    this.faune.body.setSize(this.faune.width * 0.5, this.faune.height * 0.8);

    this.anims.create({ key: "faune-idle-down", frames: [{ key: "faune", frame: "sprites/walk-down/walk-down-3.png" }] });

    this.anims.create({ key: "faune-idle-up", frames: [{ key: "faune", frame: "sprites/walk-up/walk-up-3.png" }] });

    this.anims.create({ key: "faune-idle-side", frames: [{ key: "faune", frame: "sprites/walk-side/walk-side-3.png" }] });

    this.anims.create({
      key: "faune-run-down",
      frames: this.anims.generateFrameNames("faune", { start: 1, end: 8, prefix: "sprites/run-down/run-down-", suffix: ".png" }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: "faune-run-up",
      frames: this.anims.generateFrameNames("faune", { start: 1, end: 8, prefix: "sprites/run-up/run-up-", suffix: ".png" }),
      repeat: -1,
      frameRate: 15,
    });

    this.anims.create({
      key: "faune-run-side",
      frames: this.anims.generateFrameNames("faune", { start: 1, end: 8, prefix: "sprites/run-side/run-side-", suffix: ".png" }),
      repeat: -1,
      frameRate: 15,
    });

    // Setup start
    this.faune.anims.play("faune-idle-down");
    this.physics.add.collider(this.faune, wallsLayer);
    this.cameras.main.startFollow(this.faune, true);
  }
  update(time: number, delta: number): void {
    // Move character
    if (!this.cursors || !this.faune) {
      return;
    }

    const speed = 100;
    if (this.cursors.left?.isDown) {
      this.faune.anims.play("faune-run-side", true);
      this.faune.setVelocity(-speed, 0);
      // Change sprite direction
      this.faune.scaleX = -1;
      // enable debug to see character area
      this.faune.body.offset.x = 24;
    } else if (this.cursors.right?.isDown) {
      this.faune.anims.play("faune-run-side", true);
      this.faune.setVelocity(speed, 0);
      this.faune.scaleX = 1;
      this.faune.body.offset.x = 8;
    } else if (this.cursors.up?.isDown) {
      this.faune.anims.play("faune-run-up", true);
      this.faune.setVelocity(0, -speed);
    } else if (this.cursors.down?.isDown) {
      this.faune.anims.play("faune-run-down", true);
      this.faune.setVelocity(0, speed);
    } else {
      const parts = this.faune.anims.currentAnim.key.split("-");
      parts[1] = "idle";
      this.faune.anims.play(parts.join("-"));
      this.faune.setVelocity(0, 0);
    }
  }
}
