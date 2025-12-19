/**
 * Main entry point. Handles UI selection, Firebase data fetching, 
 * and Excalibur engine initialization.
 */
import { Engine, Color, ImageSource, Loader, vec } from 'excalibur';
import { DatabaseService } from './services/database';
import { Player } from './game/entities/Player';
import { Weapon } from './game/entities/Weapon';
import './style.css';

// Game configuration
const game = new Engine({
  width: 800,
  height: 800,
  backgroundColor: Color.fromHex('#a1c8d6ff'),
  pixelArt: true, // Prevents pixel art from being smoothed
});

const dbService = new DatabaseService();
const uiContainer = document.getElementById('class-selector-test');

/**
 * Starts the game with the selected class.
 * @param classId The ID of the class to fetch from Firebase (e.g., 'master')
 */
async function startGame(classId: string) {
  // Hide the UI
  if (uiContainer) uiContainer.style.display = 'none';

  try {
    // Fetch class data from Firestore
    console.log(`Fetching data for class: ${classId}...`);
    const classData = await dbService.getGameData('classes', classId);

    // Setup the specific sprite for this class
    // Path: public/assets/graphics/classes/ID.png
    const classSprite = new ImageSource(`/assets/graphics/classes/${classId}.png`);
    const weaponSprite = new ImageSource(`/assets/graphics/weapons/goldenStick.png`);

    const player = new Player(classData, classSprite);
    const weapon = new Weapon(weaponSprite);
    player.addChild(weapon);
    game.add(player);

    player.scale = vec(2, 2); //Testing sprite scale

    // Use Excalibur Loader to wait for the image
    const loader = new Loader([classSprite, weaponSprite]);

    // Start the engine and add the player
    await game.start(loader);

    console.log(`${classData.name} has entered the arena!`);
  } catch (error) {
    console.error("Failed to start game:", error);
    if (uiContainer) uiContainer.style.display = 'block'; // Show UI again on error
  }
}

// Event Listeners for the HTML buttons
document.getElementById('masterButton')?.addEventListener('click', () => startGame('master'));
document.getElementById('berserkerButton')?.addEventListener('click', () => startGame('berserker'));