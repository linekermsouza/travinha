import * as THREE from 'three';
import { createScene } from './src/core/scene.js';
import { createPlayer } from './src/entities/player.js';
import { createBall } from './src/entities/ball.js';
import { createField } from './src/entities/field.js';
import { createGoal } from './src/entities/goal.js';
import { setupKeyboard } from './src/controls/input.js';
import { setupMouse } from './src/controls/mouse.js';
import { updatePlayer, updateBall, updateCamera } from './src/game.js';

const scene = createScene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Entidades
const player = createPlayer();
const ball = createBall();
const field = createField();
const leftGoal = createGoal('left');
const rightGoal = createGoal('right');

scene.add(player);
scene.add(ball);
scene.add(field);
scene.add(leftGoal);
scene.add(rightGoal);

// Controles
setupKeyboard();
setupMouse();

function animate() {
  requestAnimationFrame(animate);
  const playerMove = updatePlayer(player);
  updateBall(ball, player, playerMove);
  updateCamera(camera, player);
  renderer.render(scene, camera);
}
animate();
