/**
 * Main entry point. Sets up Excalibur engine and scenes.
 */
import { Engine, SolverStrategy, DisplayMode, vec } from 'excalibur';
import { MainMenuScene } from './game/scenes/MainMenuScene';
import { SelectionScene } from './game/scenes/SelectionScene';
import { GameScene } from './game/scenes/GameScene';
import './style.css';

// Game configuration
const game = new Engine({
  width: 800,
  height: 800,
  pixelArt: true,
  displayMode: DisplayMode.Fixed,
  suppressPlayButton: true, // Hide default Excalibur play button
  physics: {
    solver: SolverStrategy.Realistic,
    gravity: vec(0, 1200), // Gravity pointing down
  }
});

// Register scenes
game.addScene('menu', new MainMenuScene());
game.addScene('selection', new SelectionScene());
game.addScene('game', new GameScene());



// Start the engine and go to menu
game.start().then(() => {
  game.goToScene('menu');
});
