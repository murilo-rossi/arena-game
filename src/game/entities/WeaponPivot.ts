import { Actor, Engine, vec } from 'excalibur';
import { Weapon } from './Weapon';
import { Player } from './Player';

export class WeaponPivot extends Actor {
    private weapon: Weapon;
    private rotationSpeed: number = 0;

    constructor(weapon: Weapon, playerId: number) {
        super({
            pos: vec(0, 0), // Centered on player
            width: 1,
            height: 1
        });

        this.weapon = weapon;
        this.weapon.playerId = playerId; // Assign ownership for collision detection
        // The pivot holds the weapon
        this.addChild(weapon);
    }

    onInitialize() {

    }

    onPostUpdate(_engine: Engine, delta: number) {
        this.updateRotationSpeed();
        // Pivot handles the rotation around the player
        this.rotation += this.rotationSpeed * (delta / 1000);
    }

    public updateRotationSpeed() {
        // Get weapon's base attack speed
        let finalAtkSpeed = this.weapon.currentAtkSpeed;

        // Get player's attack speed modifiers if parent is a Player
        if (this.parent && this.parent instanceof Player) {
            const player = this.parent as Player;

            // Apply player's attack speed modifiers
            // Formula: (baseAtkSpeed + player.atkSpeedFlat) * (1 + player.atkSpeedMultiplier)
            const playerAtkSpeedFlat = player.atkSpeedIncreaseFlat;
            const playerAtkSpeedMult = player.atkSpeedIncreaseMultiplier;

            // Combine with weapon's attack speed
            finalAtkSpeed = (finalAtkSpeed + playerAtkSpeedFlat) * (1 + playerAtkSpeedMult);
        }

        this.rotationSpeed = 5 * finalAtkSpeed;
    }

    public getWeapon(): Weapon {
        return this.weapon;
    }
}
