import { Actor, vec, Engine, ImageSource, CollisionType } from 'excalibur';
import { ModifierManager } from '../systems/ModifierManager';

export class Player extends Actor {
    public modifierManager = new ModifierManager();
    private baseStats: any;

    constructor(classData: any, sprite: ImageSource) {
        super({
            pos: vec(400, 400),
            width: 64,
            height: 64,
            collisionType: CollisionType.Active // Participate in physics
        });

        this.body.bounciness = 1.0; // Perfect energy preservation
        this.body.friction = 0; // No friction
        this.body.useGravity = true;
        // Circle collider for the player (radius = width / 2)
        this.collider.useCircleCollider(32);

        this.baseStats = classData.baseStats;
        this.graphics.use(sprite.toSprite());

        // Initialize modifiers based on Firebase baseStats
        this.setupInitialModifiers();
    }

    onInitialize(engine: Engine) {
        // Set initial movement once. The physics engine handles the rest.
        const speed = this.currentMoveSpeed;
        const angle = Math.random() * Math.PI * 2;
        this.vel = vec(Math.cos(angle), Math.sin(angle)).scale(speed);
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
        return this.modifierManager.calculateStat('moveSpeed', this.baseStats.moveSpeed) * 2;
    }
}