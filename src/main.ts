import { Engine, Actor, Color, vec, ImageSource, Loader } from 'excalibur';
import './style.css';

// Resources configuration
const Resources = {
  Hero: new ImageSource('/assets/graphics/classes/master.png'),
  Weapon: new ImageSource('/assets/graphics/weapons/stick.png'),
};

// Load resources
const loader = new Loader();
for (const res of Object.values(Resources)) {
  loader.addResource(res);
}

// Game configuration
const game = new Engine({
  width: 800,
  height: 800,
  backgroundColor: Color.fromHex('#a1c8d6ff'),
  pixelArt: true, // Prevents pixel art from being smoothed
});

class Player extends Actor {
  constructor() {
    super({
      pos: vec(400, 400),
      width: 64,
      height: 64,
      color: Color.White,
    });
  }

  onInitialize() {
    // Set the player sprite
    this.graphics.use(Resources.Hero.toSprite());
    this.scale = vec(2, 2);
  }

  // Update loop
  onPostUpdate(engine: Engine, delta: number, baseSpeed: number = 2) {
    // Movement: The character keeps in a straight line at a given speed until it hits the border of the screen
    //this.pos.x += baseSpeed;
    //if (this.pos.x > game.canvas.width) {
    //  baseSpeed *= -1;
    //}
  }
}

class Weapon extends Actor {
  constructor() {
    super({
      width: 32,
      height: 32,
      anchor: vec(1.6, 0.5), // Weapon distance from player (orbital)
    });
  }

  onInitialize() {
    const weaponSprite = Resources.Weapon.toSprite();
    weaponSprite.rotation = -Math.PI / 2; // Sprite image rotation (standing up)
    this.graphics.use(weaponSprite);
  }

  onPostUpdate(engine: Engine, delta: number, baseRotationSpeed: number = 2) {
    this.rotation += baseRotationSpeed * (delta / 1000); // Weapon rotation speed
  }
}

const player = new Player();
const weapon = new Weapon();

player.addChild(weapon);

game.add(player);

game.start(loader).then(() => {
  console.log('Jogo iniciou!');
});