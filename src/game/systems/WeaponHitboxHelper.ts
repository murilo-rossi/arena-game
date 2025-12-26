import { Actor, vec } from 'excalibur';

/**
 * Interface for hitbox configuration from Firebase
 */
export interface HitboxConfig {
    type: 'box' | 'circle';
    // For box hitboxes
    width?: number;
    height?: number;
    anchorX?: number;
    anchorY?: number;
    // For circle hitboxes
    radius?: number;
}

/**
 * Helper class to apply hitboxes to weapon actors based on Firebase data
 */
export class WeaponHitboxHelper {
    /**
     * Applies the appropriate hitbox to a weapon actor
     * @param weapon The weapon actor to apply the hitbox to
     * @param hitboxConfig The hitbox configuration from Firebase
     */
    static applyHitbox(weapon: Actor, hitboxConfig: HitboxConfig): void {
        switch (hitboxConfig.type) {
            case 'box':
                this.applyBoxHitbox(weapon, hitboxConfig);
                break;
            case 'circle':
                this.applyCircleHitbox(weapon, hitboxConfig);
                break;
            default:
                console.warn(`Unknown hitbox type: ${hitboxConfig.type}`);
        }
    }

    private static applyBoxHitbox(weapon: Actor, config: HitboxConfig): void {
        const width = config.width ?? 64;
        const height = config.height ?? 8;
        const anchorX = config.anchorX ?? 1.6;
        const anchorY = config.anchorY ?? 0.5;

        weapon.collider.useBoxCollider(width, height, vec(anchorX, anchorY));
    }

    private static applyCircleHitbox(weapon: Actor, config: HitboxConfig): void {
        const radius = config.radius ?? 32;
        weapon.collider.useCircleCollider(radius);
    }

}
