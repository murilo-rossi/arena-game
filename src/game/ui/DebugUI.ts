import { Actor, Label, Font, Color, vec, Engine } from 'excalibur';
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

    constructor(engine: Engine, player1: Player, player2: Player) {
        super({
            z: 999, // Render on top of everything
        });

        this.player1 = player1;
        this.player2 = player2;

        // Create label for Player 1 (top-left)
        this.player1StatsLabel = new Label({
            text: '',
            pos: vec(10, 10),
            font: new Font({
                family: 'monospace',
                size: 14,
                color: Color.White,
            }),
        });
        this.player1StatsLabel.z = 999; // Render on top of everything

        // Create label for Player 2 (top-right)
        this.player2StatsLabel = new Label({
            text: '',
            pos: vec(engine.drawWidth - 200, 10), // Position from right edge
            font: new Font({
                family: 'monospace',
                size: 14,
                color: Color.White,
            }),
        });
        this.player2StatsLabel.z = 999; // Render on top of everything

        // Add labels to engine (hidden by default)
        engine.add(this.player1StatsLabel);
        engine.add(this.player2StatsLabel);
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
        this.updateStats();
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
        // Get Player 1 stats
        const p1Stats = this.getPlayerStats(this.player1, 'P1');
        this.player1StatsLabel.text = p1Stats;

        // Get Player 2 stats
        const p2Stats = this.getPlayerStats(this.player2, 'P2');
        this.player2StatsLabel.text = p2Stats;
    }

    /**
     * Format player stats as a string - optimized to reduce text size
     */
    private getPlayerStats(player: Player, playerName: string): string {
        const stats: string[] = [];
        const weapon = player.getWeapon();

        stats.push(`=== ${playerName} ===`);
        stats.push(`HP: ${player.currentHP.toFixed(0)}/${player.maxHP}`);
        stats.push(`Speed: ${player.currentMoveSpeed}`);
        stats.push(`Damage:${player.damage.toFixed(1)} Crit:${(player.criticalChance * 100).toFixed(0)}%`);
        stats.push(`Pos:(${player.pos.x.toFixed(0)},${player.pos.y.toFixed(0)})`);
        stats.push(`Vel: (${player.vel.x.toFixed(1)}, ${player.vel.y.toFixed(1)})`);

        if (weapon && weapon.stats) {
            stats.push(`W.Damage:${weapon.damage.toFixed(1)} W.Speed:${weapon.baseAtkSpeed.toFixed(1)}`);
        }

        return stats.join('\n');
    }

    /**
     * Called automatically every frame by Excalibur
     */
    onPostUpdate(_engine: Engine, _delta: number) {
        if (this.isVisible) {
            this.updateStats();
        }
    }
}
