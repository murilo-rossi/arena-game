/**
 * Main entry point. Handles UI selection, Firebase data fetching, 
 * and Excalibur engine initialization.
 */
import { Engine, Color, ImageSource, Loader, vec, SolverStrategy } from 'excalibur';
import { DatabaseService } from './services/database';
import { Player } from './game/entities/Player';
import { Weapon } from './game/entities/Weapon';
import { Arena } from './game/Arena';
import './style.css';

// Game configuration
const game = new Engine({
  width: 800,
  height: 800,
  backgroundColor: Color.fromHex('#a1c8d6ff'),
  pixelArt: true, // Prevents pixel art from being smoothed´
  physics: {
    solver: SolverStrategy.Realistic,
  }
});

const dbService = new DatabaseService();
const uiContainer = document.getElementById('ui-layer');

/**
 * Starts the game with the selected class.
 * @param classId The ID of the class to fetch from Firebase (e.g., 'master')
 */
async function startGame(classId: string, weaponId: string) {
  // Hide the UI
  if (uiContainer) uiContainer.style.display = 'none';

  try {
    // Fetch class data from Firestore
    console.log(`Fetching data for class: ${classId}...`);
    const classData = await dbService.getGameData('classes', classId);

    // Fetch weapon data from Firestore
    console.log(`Fetching data for weapon: ${weaponId}...`);
    const weaponData = await dbService.getGameData('weapons', weaponId);

    // Setup the specific sprite for this class
    // Path: public/assets/graphics/classes/ID.png
    const classSprite = new ImageSource(`/assets/graphics/classes/${classId}.png`);
    const weaponSprite = new ImageSource(`/assets/graphics/weapons/${weaponId}.png`);

    const player = new Player(classData, classSprite);
    const weapon = new Weapon(weaponData, weaponSprite);
    player.addChild(weapon);
    game.add(player);

    player.scale = vec(2, 2); //Testing sprite scale

    // Use Excalibur Loader to wait for the image
    const loader = new Loader([classSprite, weaponSprite]);

    // Start the engine and add the player
    await game.start(loader);

    // Initialize Arena boundaries
    new Arena(game);

    console.log(`${classData.name} has entered the arena!`);
  } catch (error) {
    console.error("Failed to start game:", error);
    if (uiContainer) uiContainer.style.display = 'block'; // Show UI again on error
  }
}

// Debug Toggle
game.input.keyboard.on('press', (evt) => {
  // Toggle debug with 'P' key
  if (evt.key === 'KeyP') {
    game.toggleDebug();
  }
});

// Selection state
let selectedClass: string | null = null;
let selectedWeapon: string | null = null;

/**
 * Initialize UI event listeners after DOM is ready
 */
function initializeUI() {
  const classButtons = document.querySelectorAll('[data-class]');
  const weaponButtons = document.querySelectorAll('[data-weapon]');

  // Handle class selection
  classButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove previous selection
      classButtons.forEach(btn => btn.classList.remove('selected'));
      // Add selection to clicked button
      button.classList.add('selected');
      // Store selection
      selectedClass = button.getAttribute('data-class');
      checkSelection();
    });
  });

  // Handle weapon selection
  weaponButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove previous selection
      weaponButtons.forEach(btn => btn.classList.remove('selected'));
      // Add selection to clicked button
      button.classList.add('selected');
      // Store selection
      selectedWeapon = button.getAttribute('data-weapon');
      checkSelection();
    });
  });
}

/**
 * Check if both class and weapon are selected, then start the game
 */
async function checkSelection() {
  if (selectedClass && selectedWeapon) {
    await startGame(selectedClass, selectedWeapon);
  }
}

// Initialize UI when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUI);
} else {
  initializeUI();
}

