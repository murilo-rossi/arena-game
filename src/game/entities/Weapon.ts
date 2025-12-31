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
        // Adjust sprite rotation if needed so it points "out"

        WeaponSprite.rotation = Math.PI / 2;
        this.graphics.use(WeaponSprite);
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