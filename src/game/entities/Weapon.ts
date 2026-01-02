import { Actor, vec, Engine, ImageSource, CollisionType } from 'excalibur';
import { WeaponHitboxHelper, type HitboxConfig } from '../systems/WeaponHitboxHelper';
import { ModifierManager } from '../systems/ModifierManager';
import type { WeaponBaseStats, ActiveSkill } from '../types/Stats';
import { Player } from './Player';

export class Weapon extends Actor {
    private baseStats: WeaponBaseStats;
    private skill?: ActiveSkill;
    public modifierManager = new ModifierManager();

    // Combat properties
    public playerId: number = 0; // Will be set by WeaponPivot
    private currentlyHittingPlayers: Set<number> = new Set();

    constructor(weaponData: any, sprite: ImageSource) {
        super({
            width: 64,
            height: 64,
            anchor: vec(1.5, 0.5), // Weapon distance from player (orbital)
            collisionType: CollisionType.Passive, // Detects collision but doesn't affect physics
            z: 10 // Render above player sprite
        });

        this.baseStats = weaponData.baseStats;
        this.skill = weaponData.activeSkill;

        // Apply size multiplier to weapon scale
        const scaleFactor = 1 + this.baseStats.sizeMultiplier;
        this.scale = vec(scaleFactor, scaleFactor);

        // Position relative to Pivot (Orbit Radius)
        // Distance from player center
        this.pos = vec(33, 0);

        // Centered anchor: sprite and hitbox rotate around weapon center
        this.anchor = vec(0, 0.5);

        // Apply hitbox from Firebase data
        if (weaponData.hitbox) {
            WeaponHitboxHelper.applyHitbox(this, weaponData.hitbox as HitboxConfig);
        } else {
            // Fallback: centered anchor for Pivot architecture
            console.warn(`Weapon ${weaponData.id} has no hitbox data. Using default.`);
            this.collider.useBoxCollider(64, 8, vec(0.5, 0.5));
        }

        let WeaponSprite = sprite.toSprite();
        WeaponSprite.rotation = Math.PI / 2;
        this.graphics.use(WeaponSprite);
    }

    onInitialize(_engine: Engine) {
        console.log(`Weapon ${this.playerId} initialized, setting up collision handlers`);

        // Collision START - first contact with enemy
        this.on('collisionstart', (evt) => {
            // evt.other is the Collider, evt.other.owner is the Actor
            const other = evt.other.owner;
            console.log(`Weapon ${this.playerId} collision with:`, other.constructor.name);

            // Check if colliding with enemy Player
            if (other instanceof Player && other.playerId !== this.playerId) {
                console.log(`Enemy player detected! P${other.playerId}`);
                // Only damage if not already hitting this player
                if (!this.currentlyHittingPlayers.has(other.playerId)) {
                    this.currentlyHittingPlayers.add(other.playerId);
                    const damage = this.damage;
                    other.takeDamage(damage, this);
                }
            }
        });

        // Collision END - weapon exited hitbox
        this.on('collisionend', (evt) => {
            const other = evt.other.owner;

            if (other instanceof Player) {
                // Reset cooldown for this player
                this.currentlyHittingPlayers.delete(other.playerId);
                console.log(`Weapon ${this.playerId} exited P${other.playerId}`);
            }
        });
    }

    // Rotation is now handled by WeaponPivot
    onPostUpdate(_engine: Engine, _delta: number) {
        // No rotation logic here
    }

    // === Core Stats Getters ===

    get damage(): number {
        return this.modifierManager.calculateStat('damage', this.baseStats.damage);
    }

    get baseAtkSpeed(): number {
        return this.baseStats.baseAtkSpeed;
    }

    get sizeMultiplier(): number {
        return this.modifierManager.calculateStat('sizeMultiplier', this.baseStats.sizeMultiplier);
    }

    // === Modifier Getters ===

    get atkSpeedMultiplier(): number {
        return this.baseStats.atkSpeedMultiplier;
    }

    get damageIncreaseFlat(): number {
        return this.baseStats.damageIncreaseFlat;
    }

    get damageIncreaseMultiplier(): number {
        return this.baseStats.damageIncreaseMultiplier;
    }

    // === Skill Getter ===

    get activeSkill(): ActiveSkill | undefined {
        return this.skill;
    }

    // === Legacy getter for compatibility ===

    get stats(): WeaponBaseStats {
        return this.baseStats;
    }

    // currentAtkSpeed will be moved to Player in next refactoring
    get currentAtkSpeed(): number {
        return this.modifierManager.calculateStat('atkSpeed', this.baseStats.baseAtkSpeed);
    }
}