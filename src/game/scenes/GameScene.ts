import { Scene, Engine, ImageSource, vec, Color } from 'excalibur';
import { DatabaseService } from '../../services/database';
import { Player } from '../entities/Player';
import { Weapon } from '../entities/Weapon';
import { Arena } from '../components/Arena';
import { DebugUI } from '../ui/DebugUI';
import { OnHitEffectManager } from '../systems/OnHitEffectManager';

interface GameData {
    p1: { class: string; weapon: string };
    p2: { class: string; weapon: string };
}

/**
 * Game Scene - Where the actual gameplay happens
 */
export class GameScene extends Scene {
    private debugUI: DebugUI | null = null;
    private dbService = new DatabaseService();
    public onHitEffectManager!: OnHitEffectManager;

    async onActivate(context: { engine: Engine }) {
        const engine = context.engine;

        // Initialize OnHitEffectManager
        this.onHitEffectManager = new OnHitEffectManager();

        // Change background to arena color
        engine.backgroundColor = Color.fromHex('#a1c8d6');

        // Get game data from engine (set by SelectionScene)
        const gameData = (engine as any).gameData as GameData;

        if (!gameData) {
            console.error('No game data found!');
            engine.goToScene('menu');
            return;
        }

        try {
            // Fetch P1 data
            console.log(`P1: ${gameData.p1.class}, ${gameData.p1.weapon}`);
            const p1ClassData = await this.dbService.getGameData('classes', gameData.p1.class);
            const p1WeaponData = await this.dbService.getGameData('weapons', gameData.p1.weapon);
            const p1ClassSprite = new ImageSource(`/assets/graphics/classes/${gameData.p1.class}.png`);
            const p1WeaponSprite = new ImageSource(`/assets/graphics/weapons/${gameData.p1.weapon}.png`);

            // Fetch P2 data (randomized)
            console.log(`P2: ${gameData.p2.class}, ${gameData.p2.weapon}`);
            const p2ClassData = await this.dbService.getGameData('classes', gameData.p2.class);
            const p2WeaponData = await this.dbService.getGameData('weapons', gameData.p2.weapon);
            const p2ClassSprite = new ImageSource(`/assets/graphics/classes/${gameData.p2.class}.png`);
            const p2WeaponSprite = new ImageSource(`/assets/graphics/weapons/${gameData.p2.weapon}.png`);

            // Load sprites
            await Promise.all([
                p1ClassSprite.load(),
                p1WeaponSprite.load(),
                p2ClassSprite.load(),
                p2WeaponSprite.load()
            ]);

            // Create Player 1
            const player1 = new Player(p1ClassData, p1ClassSprite, 1);
            const weapon1 = new Weapon(p1WeaponData, p1WeaponSprite);
            player1.setWeapon(weapon1);
            player1.pos = vec(200, 400);
            player1.scale = vec(2.5, 2.5);
            this.add(player1);

            // Create Player 2
            const player2 = new Player(p2ClassData, p2ClassSprite, 2);
            const weapon2 = new Weapon(p2WeaponData, p2WeaponSprite);
            player2.setWeapon(weapon2);
            player2.pos = vec(600, 400);
            player2.scale = vec(2.5, 2.5);
            this.add(player2);

            // Arena boundaries
            new Arena(engine);

            // Debug UI
            this.debugUI = new DebugUI(engine, player1, player2);
            this.add(this.debugUI);

            // Death handlers
            player1.on('death', () => this.handleGameOver(engine, 2));
            player2.on('death', () => this.handleGameOver(engine, 1));

            console.log('Game started!');
        } catch (error) {
            console.error('Failed to start game:', error);
            engine.goToScene('menu');
        }
    }

    private handleGameOver(engine: Engine, winnerId: number) {
        console.log(`Game Over! Player ${winnerId} wins!`);
        alert(`Player ${winnerId} wins!`);

        // Restore main menu background color
        engine.backgroundColor = Color.fromHex('#2b2b2b');

        // Clear scene and go back to menu
        this.clear();
        engine.goToScene('menu');
    }

    onDeactivate() {
        // Clean up when leaving scene
        this.clear();
        this.debugUI = null;
    }
}
