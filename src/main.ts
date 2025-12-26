/**
 * Main entry point. Handles UI selection, Firebase data fetching, 
 * and Excalibur engine initialization.
 */
import { Engine, Color, ImageSource, Loader, vec, SolverStrategy } from 'excalibur';
import { DatabaseService } from './services/database';
import { Player } from './game/entities/Player';
import { Weapon } from './game/entities/Weapon';
import { Arena } from './game/components/Arena';
import { DebugUI } from './game/ui/DebugUI';
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

const engineContainer = document.getElementById('engine-container');
const canvas = game.canvas;
if (engineContainer && canvas) {
  engineContainer.appendChild(canvas);
}

const dbService = new DatabaseService();

// Selection state for both players
interface PlayerSelection {
  class: string | null;
  weapon: string | null;
}

const player1Selection: PlayerSelection = { class: null, weapon: null };
const player2Selection: PlayerSelection = { class: null, weapon: null };

// Debug UI instance (will be initialized after game starts)
let debugUI: DebugUI | null = null;

/**
 * Starts the game with both players.
 */
async function startGame() {
  // Hide the selection UI
  const player1UI = document.getElementById('player1-selection');
  const player2UI = document.getElementById('player2-selection');

  if (player1UI) player1UI.style.display = 'none';
  if (player2UI) player2UI.style.display = 'none';

  try {
    // Fetch data for Player 1
    console.log(`Fetching data for Player 1: ${player1Selection.class}, ${player1Selection.weapon}...`);
    const p1ClassData = await dbService.getGameData('classes', player1Selection.class!);
    const p1WeaponData = await dbService.getGameData('weapons', player1Selection.weapon!);
    const p1ClassSprite = new ImageSource(`/assets/graphics/classes/${player1Selection.class}.png`);
    const p1WeaponSprite = new ImageSource(`/assets/graphics/weapons/${player1Selection.weapon}.png`);

    // Fetch data for Player 2
    console.log(`Fetching data for Player 2: ${player2Selection.class}, ${player2Selection.weapon}...`);
    const p2ClassData = await dbService.getGameData('classes', player2Selection.class!);
    const p2WeaponData = await dbService.getGameData('weapons', player2Selection.weapon!);
    const p2ClassSprite = new ImageSource(`/assets/graphics/classes/${player2Selection.class}.png`);
    const p2WeaponSprite = new ImageSource(`/assets/graphics/weapons/${player2Selection.weapon}.png`);

    // Create Player 1
    const player1 = new Player(p1ClassData, p1ClassSprite);
    const weapon1 = new Weapon(p1WeaponData, p1WeaponSprite);
    player1.addChild(weapon1);
    player1.pos = vec(200, 400); // Spawn position for Player 1
    player1.scale = vec(2.5, 2.5);
    game.add(player1);

    // Create Player 2
    const player2 = new Player(p2ClassData, p2ClassSprite);
    const weapon2 = new Weapon(p2WeaponData, p2WeaponSprite);
    player2.addChild(weapon2);
    player2.pos = vec(600, 400); // Spawn position for Player 2
    player2.scale = vec(2.5, 2.5);
    game.add(player2);

    // Load all sprites
    const loader = new Loader([p1ClassSprite, p1WeaponSprite, p2ClassSprite, p2WeaponSprite]);

    // Start the engine
    await game.start(loader);

    // Initialize Arena boundaries
    new Arena(game);

    // Initialize Debug UI
    debugUI = new DebugUI(game, player1, player2);
    game.add(debugUI); // Add to engine so onPostUpdate is called every frame

    console.log(`Both players have entered the arena!`);
  } catch (error) {
    console.error("Failed to start game:", error);
    // Show UI again on error
    if (player1UI) player1UI.style.display = 'flex';
    if (player2UI) player2UI.style.display = 'flex';
  }
}

// Debug Toggle
game.input.keyboard.on('press', (evt) => {
  if (evt.key === 'KeyP') {
    game.toggleDebug(); // Toggle Excalibur's built-in debug
    if (debugUI) {
      debugUI.toggle(); // Toggle custom stats display
    }
  }
});

/**
 * Check if both players have made their selections
 */
function checkBothPlayersReady() {
  if (player1Selection.class && player1Selection.weapon &&
    player2Selection.class && player2Selection.weapon) {
    startGame();
  }
}

/**
 * Initialize UI event listeners after DOM is ready
 */
function initializeUI() {
  // Get all buttons for both players
  const allButtons = document.querySelectorAll('button[data-player]');

  allButtons.forEach(button => {
    button.addEventListener('click', () => {
      const playerNum = button.getAttribute('data-player');
      const classId = button.getAttribute('data-class');
      const weaponId = button.getAttribute('data-weapon');

      if (playerNum === '1') {
        if (classId) {
          // Remove selection from other class buttons for Player 1
          document.querySelectorAll('button[data-player="1"][data-class]').forEach(btn => {
            btn.classList.remove('selected');
          });
          button.classList.add('selected');
          player1Selection.class = classId;
        } else if (weaponId) {
          // Remove selection from other weapon buttons for Player 1
          document.querySelectorAll('button[data-player="1"][data-weapon]').forEach(btn => {
            btn.classList.remove('selected');
          });
          button.classList.add('selected');
          player1Selection.weapon = weaponId;
        }
      } else if (playerNum === '2') {
        if (classId) {
          // Remove selection from other class buttons for Player 2
          document.querySelectorAll('button[data-player="2"][data-class]').forEach(btn => {
            btn.classList.remove('selected');
          });
          button.classList.add('selected');
          player2Selection.class = classId;
        } else if (weaponId) {
          // Remove selection from other weapon buttons for Player 2
          document.querySelectorAll('button[data-player="2"][data-weapon]').forEach(btn => {
            btn.classList.remove('selected');
          });
          button.classList.add('selected');
          player2Selection.weapon = weaponId;
        }
      }

      // Check if both players are ready
      checkBothPlayersReady();
    });
  });
}

// Initialize UI when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeUI);
} else {
  initializeUI();
}
