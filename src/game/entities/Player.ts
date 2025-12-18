import { Actor, vec, ImageSource } from 'excalibur';
import { ModifierManager } from '../systems/ModifierManager';

export class Player extends Actor {
    public modifierManager = new ModifierManager();
    private baseStats: any;

    constructor(classData: any, sprite: ImageSource) {
        super({
            pos: vec(400, 300),
            width: 64,
            height: 64
        });

        this.baseStats = classData.baseStats;
        this.graphics.use(sprite.toSprite());

        // Initialize modifiers based on Firebase baseStats
        this.setupInitialModifiers();
    }

    private setupInitialModifiers() {
        // Map the JSON keys to the modifier system
        for (const [key, value] of Object.entries(this.baseStats)) {
            // Only apply to modifiers (multipliers and flats)
            if (typeof value === 'number' && (key.toLowerCase().includes('multiplier') ||
                key.toLowerCase().includes('flat'))) {
                const type = key.toLowerCase().includes('multiplier') ? 'multiplier' : 'flat';

                this.modifierManager.addModifier({
                    stat: key,
                    value: value,
                    type: type
                });
            }
        }
    }

    // Example of how to get a calculated stat
    get currentMoveSpeed(): number {
        return this.modifierManager.calculateStat('moveSpeed', this.baseStats.moveSpeed);
    }
}