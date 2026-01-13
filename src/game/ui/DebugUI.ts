import { Actor, Label, Font, Color, vec, Engine, CoordPlane, Keys } from 'excalibur';
import { Player } from '../entities/Player';

/**
 * Debug UI overlay that displays player stats in canvas corners
 */
export class DebugUI extends Actor {
    private player1StatsLabel: Label;
    private player2StatsLabel: Label;
    private isVisible: boolean = false;
    private player1: Player;
    private player2: Player;

    constructor(_engine: Engine, player1: Player, player2: Player) {
        super({
            name: 'DebugUI',
            pos: vec(0, 0),
            width: 800,
            height: 800,
            z: 9999,
        });

        // Ensure UI stays fixed to screen
        this.transform.coordPlane = CoordPlane.Screen;

        this.player1 = player1;
        this.player2 = player2;

        // Create label for Player 1 (top-left)
        this.player1StatsLabel = new Label({
            text: 'Loading...',
            pos: vec(10, 20),
            font: new Font({
                family: 'monospace',
                size: 12,
                color: Color.White,
            })
        });

        // Create label for Player 2 (top-right)
        this.player2StatsLabel = new Label({
            text: 'Loading...',
            pos: vec(710, 20),
            font: new Font({
                family: 'monospace',
                size: 12,
                color: Color.White,
            }),
        });

        this.addChild(this.player1StatsLabel);
        this.addChild(this.player2StatsLabel);

        this.hide();
    }

    /**
     * Toggle debug UI visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Show debug UI
     */
    show() {
        this.isVisible = true;
        this.player1StatsLabel.graphics.visible = true;
        this.player2StatsLabel.graphics.visible = true;
    }

    /**
     * Hide debug UI
     */
    hide() {
        this.isVisible = false;
        this.player1StatsLabel.graphics.visible = false;
        this.player2StatsLabel.graphics.visible = false;
    }

    /**
     * Update stats display
     */
    private updateStats() {
        if (!this.isVisible) return;

        const p1Stats = this.getPlayerStats(this.player1, 'P1');
        this.player1StatsLabel.text = p1Stats;

        const p2Stats = this.getPlayerStats(this.player2, 'P2');
        this.player2StatsLabel.text = p2Stats;
    }

    /**
     * Format player stats as a string
     */
    private getPlayerStats(player: Player, playerName: string): string {
        const stats: string[] = [];
        const weapon = player.getWeapon();

        stats.push(`=== ${playerName} ===`);
        stats.push(`HP: ${player.currentHP.toFixed(0)}/${player.maxHP}`);
        stats.push(`Speed: ${player.currentMoveSpeed}`);
        stats.push(`Damage: ${player.damage.toFixed(1)}`);
        stats.push(`Crit: ${(player.criticalChance * 100).toFixed(0)}%`);

        if (weapon && weapon.stats) {
            stats.push(`W.Dmg: ${weapon.damage.toFixed(1)}`);
        }

        return stats.join('\n');
    }

    /**
     * Called automatically every frame
     */
    onPostUpdate(_engine: Engine, _delta: number) {
        this.updateStats();
    }

    onInitialize(engine: Engine) {
        engine.input.keyboard.on('press', (evt) => {
            if (evt.key === Keys.P) {
                this.toggle();
                engine.toggleDebug();
            }
        });
    }
}
