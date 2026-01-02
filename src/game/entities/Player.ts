import { Actor, vec, Engine, ImageSource, CollisionType } from 'excalibur';
import { ModifierManager } from '../systems/ModifierManager';
import type { CharacterBaseStats, ActiveSkill, OnHitModifiers } from '../types/Stats';
import type { Weapon } from './Weapon';
import { WeaponPivot } from './WeaponPivot';

export class Player extends Actor {
    public modifierManager = new ModifierManager();
    private baseStats: CharacterBaseStats;
    private skill?: ActiveSkill;
    public onHitModifiers?: OnHitModifiers;
    private weaponPivot?: WeaponPivot;

    // Combat properties
    public playerId: number;
    public currentHP: number;
    public maxHP: number;

    constructor(classData: any, sprite: ImageSource, playerId: number) {
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
        this.onHitModifiers = classData.onHitTakenGiven;
        this.skill = classData.activeSkill;
        this.graphics.use(sprite.toSprite());

        // Combat initialization
        this.playerId = playerId;
        this.maxHP = this.baseStats.hp;
        this.currentHP = this.maxHP;

        // Initialize modifiers based on Firebase baseStats
        this.setupInitialModifiers();
    }

    onInitialize(engine: Engine) {
        // Set initial movement once. The physics engine handles the rest.
        const speed = this.currentMoveSpeed;
        const angle = Math.random() * Math.PI * 2;
        this.vel = vec(Math.cos(angle), Math.sin(angle)).scale(speed);
    }

    /**
     * Assigns a weapon to the player using a pivot for rotation
     */
    public setWeapon(weapon: Weapon) {
        // Create pivot and pass playerId for ownership tracking
        this.weaponPivot = new WeaponPivot(weapon, this.playerId);
        this.addChild(this.weaponPivot);
    }

    public getWeapon(): Weapon | undefined {
        return this.weaponPivot?.getWeapon();
    }

    /**
     * Apply damage to this player
     */
    public takeDamage(amount: number, _source?: Weapon) {
        this.currentHP -= amount;
        console.log(`P${this.playerId} took ${amount.toFixed(1)} dmg. HP: ${this.currentHP.toFixed(0)}/${this.maxHP}`);

        if (this.currentHP <= 0) {
            this.currentHP = 0;
            this.onDeath();
        }
    }

    private onDeath() {
        console.log(`Player ${this.playerId} has died!`);
        this.emit('death', { playerId: this.playerId });
        this.kill(); // Remove from scene
    }

    get isDead(): boolean {
        return this.currentHP <= 0;
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

    // Getters 
    get hp(): number {
        return this.baseStats.hp;
    }

    get currentMoveSpeed(): number {
        return this.modifierManager.calculateStat('moveSpeed', this.baseStats.moveSpeed) * 2;
    }

    get sizeMultiplier(): number {
        return this.modifierManager.calculateStat('sizeMultiplier', this.baseStats.sizeMultiplier);
    }

    get damage(): number {
        const weapon = this.getWeapon();
        if (!weapon || !weapon.damage) {
            return this.baseStats.damageIncreaseFlat; // Fallback if no weapon
        }

        // Base damage from weapon + player's flat damage increase
        const baseDamage = weapon.damage + this.baseStats.damageIncreaseFlat;

        // Apply player's damage multiplier
        return this.modifierManager.calculateStat('damage', baseDamage);
    }

    get criticalChance(): number {
        return this.baseStats.criticalChance;
    }

    get criticalMultiplier(): number {
        return this.baseStats.criticalMultiplier;
    }

    get criticalDamageMultiplier(): number {
        return this.baseStats.criticalDamageIncreaseMultiplier;
    }

    get atkSpeedIncreaseFlat(): number {
        return this.baseStats.atkSpeedIncreaseFlat;
    }

    get atkSpeedIncreaseMultiplier(): number {
        return this.baseStats.atkSpeedIncreaseMultiplier;
    }

    get defenseFlat(): number {
        return this.baseStats.defenseIncreaseFlat;
    }

    get defenseMultiplier(): number {
        return this.baseStats.defenseIncreaseMultiplier;
    }

    get activeSkill(): ActiveSkill | undefined {
        return this.skill;
    }

    // Raw baseStats access for debugging

    get stats(): CharacterBaseStats {
        return this.baseStats;
    }
}
