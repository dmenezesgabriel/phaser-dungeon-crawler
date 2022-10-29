import Phaser from "phaser";
import { debugDraw } from "../utils/debug";
import { createLizardAnims } from "../anims/EnemyAnims";
import { createCharacterAnims } from "../anims/CharacterAnims";
import Lizard from "../enemies/lizard";
import "../characters/Faune";
import Faune from "../characters/Faune";
import { sceneEvents } from "../events/EventCenter";
import { createTreasureAnims } from "../anims/TreasureAnims";
export default class Game extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private faune!: Faune;
  private knives!: Phaser.Physics.Arcade.Group;
  private lizards!: Phaser.Physics.Arcade.Group;
  private playerLizardCollider!: Phaser.Physics.Arcade.Collider;

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
    createTreasureAnims(this.anims);

    // Add tile maps
    const map = this.make.tilemap({ key: "dungeon" });
    const tileset = map.addTilesetImage("dungeon", "tiles", 16, 16);

    // Add before player layer
    map.createLayer("Ground", tileset);

    // Add weapons
    this.knives = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
    });

    // Add player
    this.faune = this.add.faune(128, 128, "faune");
    this.faune.setKnives(this.knives);

    // Add after player layer
    const wallsLayer = map.createLayer("Walls", tileset);

    // Add walls layer colision
    wallsLayer.setCollisionByProperty({ collides: true });

    // Add items
    const chests = this.physics.add.staticGroup();
    const chestLayer = map.getObjectLayer("Chests");
    chestLayer.objects.forEach((chestObject) => {
      chests.get(
        chestObject.x! + chestObject.width! * 0.5,
        chestObject.y! - chestObject.height! * 0.5,
        "treasure",
        "chest_empty_open_anim_f0.png"
      );
    });

    // Debug collisions
    debugDraw(wallsLayer, this);

    // Setup camera
    this.cameras.main.startFollow(this.faune, true);

    // Add enemies
    this.lizards = this.physics.add.group({
      classType: Lizard,
      createCallback: (gameObject) => {
        // Listen to on collide event
        const lizardGameObject = gameObject as Lizard;
        lizardGameObject.body.onCollide = true;
      },
    });

    this.lizards.get(256, 128, "lizard");

    // Add collisions
    this.physics.add.collider(this.faune, wallsLayer);
    this.physics.add.collider(this.faune, chests);
    this.physics.add.collider(this.lizards, wallsLayer);
    this.physics.add.collider(
      this.knives,
      wallsLayer,
      this.handleKnifeWallCollision,
      undefined,
      this
    );
    this.physics.add.collider(
      this.knives,
      this.lizards,
      this.handleKnifeLizardCollision,
      undefined,
      this
    );

    this.playerLizardCollider = this.physics.add.collider(
      this.lizards,
      this.faune,
      this.handlePlayerLizardCollision,
      undefined,
      this
    );
  }

  // Weapons wall collision handler
  private handleKnifeWallCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
  }

  // Weapons enemy collision handler
  private handleKnifeLizardCollision(
    obj1: Phaser.GameObjects.GameObject,
    obj2: Phaser.GameObjects.GameObject
  ) {
    this.knives.killAndHide(obj1);
  }

  // Enemy collision handler
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

    // If dead don't collide
    if (this.faune.health <= 0) {
      this.playerLizardCollider?.destroy();
    }
  }

  update(time: number, delta: number): void {
    // handle player movement
    if (this.faune) {
      this.faune.update(this.cursors);
    }
  }
}
