import * as THREE from 'three';
import { getKeys } from './controls/input.js';
import { getRotation } from './controls/mouse.js';

export function updatePlayer(player) {
  const keys = getKeys();
  const { yaw } = getRotation();

  // direção para frente
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  // direção para a direita
  const right = new THREE.Vector3(-Math.cos(yaw), 0, Math.sin(yaw));

  const speed = 0.2;
  const move = new THREE.Vector3();

  if (keys['w']) move.add(forward);      // frente
  if (keys['s']) move.sub(forward);      // trás
  if (keys['a']) move.sub(right);        // esquerda
  if (keys['d']) move.add(right);        // direita

  move.normalize().multiplyScalar(speed);
  player.position.add(move);

  // faz o boneco olhar para frente
  if (move.lengthSq() > 0) {
    player.lookAt(player.position.clone().add(move));
  }
}

export function updateCamera(camera, player) {
  const { yaw } = getRotation();

  // direção para frente
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).normalize();

  // offset relativo (atrás, acima, lateral)
  const cameraOffset = new THREE.Vector3(-2, 3.5, -4);
  // -2 = desloca para a esquerda (faz a câmera ficar sobre o ombro direito)
  // 3.5 = altura acima da cabeça/ombro
  // -6  = distância atrás do jogador

  // aplica rotação do jogador ao offset
  const rotatedOffset = cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0,1,0), yaw);

  // posição final da câmera
  camera.position.copy(player.position).add(rotatedOffset);

  // mira para frente, garantindo que o jogador esteja no quadro
  const target = player.position.clone().add(forward.multiplyScalar(20));
  target.y += 2;
  camera.lookAt(target);
}
