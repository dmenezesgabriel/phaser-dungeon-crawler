import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import { createLizardAnims } from "../anims/EnemyAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";
import Lizard from "../enemies/lizard";
import "../characters/Faune";
import Faune from "../characters/Faune";
import { sceneEvents } from "../events/EventCenter";

export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;

  constructor() {
    super("game");
  }

  preload() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  create() {
    // Run UI
    this.scene.run("game-ui");

    // Create animations
    createLizardAnims(this.anims);
    createCharacterAnims(this.anims);

    // Add tile maps
    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles", 16, 16);

    // Add before player layer
    map.createLayer("Ground", tileset);

    // Add player
    this.faune = this.add.faune(128, 128, "faune");

    // Add after player layer
    const wallsLayer = map.createLayer("Walls", tileset);

    // Add walls layer colision
    wallsLayer.setCollisionByProperty({ colides: true });

    // Debug collisions
    debugDraw(wallsLayer, this);

    // Setup camera
    this.cameras.main.startFollow(this.faune, true);

    // Add enemies
    const lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (gameObject) => {
        // Listen to on collide event
        const lizardGameObject = gameObject as Lizard;
        lizardGameObject.body.onCollide = true;
      },
    });

    lizards.get(256, 128, "lizard");

    // Add collisions
    this.physics.add.collider(this.faune, wallsLayer);
    this.physics.add.collider(lizards, wallsLayer);
    this.physics.add.collider(
      lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
  }

  // Enemy colision handler
  private handlePlayerLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    const lizard = obj2 as Lizard;

    // Direction Vector
    const dx = this.faune.x - lizard.x;
    const dy = this.faune.y - lizard.y;

    // Push player away on hit
    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    // Take damage
    this.faune.handleDamage(dir);

    // Reduce life
    sceneEvents.emit("player-health-changed", this.faune.health);
  }

  update(time: number, delta: number): void {
    // handle player movement
    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}
