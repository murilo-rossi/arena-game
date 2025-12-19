import { Actor, vec, Engine, ImageSource } from 'excalibur';

export class Weapon extends Actor {
    constructor(sprite: ImageSource) {
        super({
            width: 32,
            height: 32,
            anchor: vec(1.6, 0.5), // Weapon distance from player (orbital)
        });

        let WeaponSprite = sprite.toSprite();
        WeaponSprite.rotation = -Math.PI / 2; // Sprite image rotation (standing up)
        this.graphics.use(WeaponSprite);
    }

    onPostUpdate(engine: Engine, delta: number, baseRotationSpeed: number = 2) {
        this.rotation += baseRotationSpeed * (delta / 1000); // Weapon rotation speed
    }
}