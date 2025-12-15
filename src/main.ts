import './style.css'
import { Renderer } from './core/renderer';

const renderer = new Renderer();

const heroImg = new Image();
heroImg.src = '/assets/graphics/classes/master.png';

const weaponImg = new Image();
weaponImg.src = '/assets/graphics/weapons/stick.png';

let playerX = 400;
let playerY = 300;
let angle = 0;
function gameLoop() {
  renderer.clear();

  // Animação se movendo pela arena
  playerX += Math.sin(Date.now() / 500) * 2;

  // Desenha o Personagem
  renderer.drawSprite(heroImg, playerX, playerY, 64);

  // Desenha a Arma (orbitando o personagem para testar)
  angle += 0.05;
  const weaponX = playerX + Math.cos(angle) * 50;
  const weaponY = playerY + Math.sin(angle) * 50;
  renderer.drawSprite(weaponImg, weaponX, weaponY, 32);

  requestAnimationFrame(gameLoop);
}

gameLoop();