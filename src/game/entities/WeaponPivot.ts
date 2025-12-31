import { Actor, Engine, vec } from 'excalibur';
import { Weapon } from './Weapon';

export class WeaponPivot extends Actor {
    private weapon: Weapon;
    private rotationSpeed: number = 0;

    constructor(weapon: Weapon) {
        super({
            pos: vec(0, 0), // Centered on player
            width: 1,
            height: 1
        });

        this.weapon = weapon;
        // The pivot holds the weapon
        this.addChild(weapon);
    }

    onInitialize() {
        // Calculate initial rotation speed based on weapon stats
        // TODO: update this later when stats change dynamically
        this.updateRotationSpeed();
    }

    onPostUpdate(_engine: Engine, delta: number) {
        // Pivot handles the rotation around the player
        this.rotation += this.rotationSpeed * (delta / 1000);
    }

    public updateRotationSpeed() {
        // Base speed factor (5 rad/s) * weapon base speed
        this.rotationSpeed = 5 * this.weapon.baseAtkSpeed;
    }

    public getWeapon(): Weapon {
        return this.weapon;
    }
}
