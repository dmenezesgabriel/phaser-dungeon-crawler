import Phaser from "phaser";
import { gameConfig } from "./config";
import GameScene from "./scenes/Game";
import Preloader from "./scenes/Preloader";
import GameUI from "./scenes/GameUI";

export const game = new Phaser.Game(
  Object.assign(gameConfig, {
    scene: [Preloader, GameScene, GameUI],
  })
);
