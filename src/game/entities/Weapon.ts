import { Actor, vec, Engine, ImageSource, CollisionType } from 'excalibur';
import { WeaponHitboxHelper, type HitboxConfig } from '../systems/WeaponHitboxHelper';

export class Weapon extends Actor {
    private weaponData: any;

    constructor(weaponData: any, sprite: ImageSource) {
        super({
            width: 64,
            height: 64,
            anchor: vec(1.6, 0.5), // Weapon distance from player (orbital)
            collisionType: CollisionType.Passive, // Detects collision but doesn't affect physics
            z: 10 // Render above player sprite
        });

        this.weaponData = weaponData;

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

    onPostUpdate(_engine: Engine, delta: number, baseRotationSpeed: number = 2) {
        this.rotation += baseRotationSpeed * (delta / 1000); // Weapon rotation speed
    }

    // Getter for weapon stats (for future use in damage calculation, etc.)
    get stats() {
        return this.weaponData.baseStats;
    }

    get activeSkill() {
        return this.weaponData.activeSkill;
    }
}