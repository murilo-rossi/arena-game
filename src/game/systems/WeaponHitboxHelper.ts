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
        // Use centered anchor for Pivot architecture (ignores old Firebase anchor values)
        // This ensures hitbox rotates correctly with sprite around weapon center
        weapon.collider.useBoxCollider(width, height, vec(0, 0.5));
    }

    private static applyCircleHitbox(weapon: Actor, config: HitboxConfig): void {
        const radius = config.radius ?? 32;
        weapon.collider.useCircleCollider(radius);
    }

}
