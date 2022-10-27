import Phaser from "phaser";
import { sceneEvents } from "../events/EventCenter";

export default class GameUI extends Phaser.Scene {
  private hearts!: Phaser.GameObjects.Group;

  constructor() {
    super({ key: "game-ui" });
  }

  create() {
    this.hearts = this.add.group({
      classType: Phaser.GameObjects.Image,
    });

    this.hearts.createMultiple({
      key: "ui-heart-full",
      setXY: { x: 10, y: 10, stepX: 16 },
      quantity: 3,
    });

    sceneEvents.on(
      "player-health-changed",
      this.handlePlayerHealthChanged,
      this // context
    );

    // Clean Up
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(
        "player-healt-changed",
        this.handlePlayerHealthChanged,
        this // context
      );
    });
  }
  private handlePlayerHealthChanged(health: number) {
    this.hearts.children.each((gameObject, index) => {
      const heart = gameObject as Phaser.GameObjects.Image;
      if (index < health) {
        heart.setTexture("ui-heart-full");
      } else {
        heart.setTexture("ui-heart-empty");
      }
    });
  }
}
