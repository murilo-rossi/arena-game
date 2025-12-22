import { Actor, Color, CollisionType, Engine, vec } from 'excalibur';

export class Arena {
    constructor(game: Engine) {
        const wallThickness = 10;
        const wallColor = Color.fromHex('#3b4350ff'); // Making walls invisible or colored

        // Top Wall
        const topWall = new Actor({
            pos: vec(game.drawWidth / 2, 0),
            width: game.drawWidth,
            height: wallThickness,
            color: wallColor,
            collisionType: CollisionType.Fixed
        });

        // Bottom Wall
        const bottomWall = new Actor({
            pos: vec(game.drawWidth / 2, game.drawHeight),
            width: game.drawWidth,
            height: wallThickness,
            color: wallColor,
            collisionType: CollisionType.Fixed
        });

        // Left Wall
        const leftWall = new Actor({
            pos: vec(0, game.drawHeight / 2),
            width: wallThickness,
            height: game.drawHeight,
            color: wallColor,
            collisionType: CollisionType.Fixed
        });

        // Right Wall
        const rightWall = new Actor({
            pos: vec(game.drawWidth, game.drawHeight / 2),
            width: wallThickness,
            height: game.drawHeight,
            color: wallColor,
            collisionType: CollisionType.Fixed
        });

        game.add(topWall);
        game.add(bottomWall);
        game.add(leftWall);
        game.add(rightWall);
    }
}
