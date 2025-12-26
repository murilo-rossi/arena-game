import { Actor, vec, Engine, ImageSource, CollisionType } from 'excalibur';
import { WeaponHitboxHelper, type HitboxConfig } from '../systems/WeaponHitboxHelper';
import { ModifierManager } from '../systems/ModifierManager';
import type { WeaponBaseStats, ActiveSkill } from '../types/Stats';

export class Weapon extends Actor {
    private baseStats: WeaponBaseStats;
    private skill?: ActiveSkill;
    public modifierManager = new ModifierManager();

    constructor(weaponData: any, sprite: ImageSource) {
        super({
            width: 64,
            height: 64,
            anchor: vec(1.6, 0.5), // Weapon distance from player (orbital)
            collisionType: CollisionType.Passive, // Detects collision but doesn't affect physics
            z: 10 // Render above player sprite
        });

        this.baseStats = weaponData.baseStats;
        this.skill = weaponData.activeSkill;

        // Apply size multiplier to weapon scale
        // sizeMultiplier: 0.0 = normal size (1.0), 0.4 = 1.4x size
        const scaleFactor = 1 + this.baseStats.sizeMultiplier;
        this.scale = vec(scaleFactor, scaleFactor);

        // Apply hitbox from Firebase data
        if (weaponData.hitbox) {
            WeaponHitboxHelper.applyHitbox(this, weaponData.hitbox as HitboxConfig);
        } else {
            // Fallback to default box hitbox if no data
            console.warn(`Weapon ${weaponData.id} has no hitbox data. Using default.`);
            this.collider.useBoxCollider(64, 8, vec(1.6, 0.5));
        }

        let WeaponSprite = sprite.toSprite();
        WeaponSprite.rotation = -Math.PI / 2; // Sprite image rotation (standing up)
        this.graphics.use(WeaponSprite);
    }

    onPostUpdate(_engine: Engine, delta: number) {
        // Rotation speed based on attack speed from Firebase
        // baseAtkSpeed: 1.0 = normal speed, 0.7 = slower, 1.5 = faster
        const rotationSpeed = 5 * this.baseStats.baseAtkSpeed;
        this.rotation += rotationSpeed * (delta / 1000);
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