import * as THREE from 'three';
import { getKeys } from './controls/input.js';
import { getRotation } from './controls/mouse.js';

// Estado físico da bola
const ballVelocity = new THREE.Vector3(0, 0, 0);
const ballRadius = 0.35;
const playerRadius = 0.5;

// Função que calcula a altura exata do terreno (rua vs calçada)
export function getTerrainHeight(x, z) {
  const absX = Math.abs(x);
  const absZ = Math.abs(z);

  // Rua principal de asfalto (y = 0.0)
  if (absZ <= 7.0 && absX <= 35.0) {
    return 0.0;
  }

  // Cruzamentos de rua nas pontas (asfalto y = 0.0)
  if (absX >= 28.0 && absZ <= 25.0) {
    return 0.0;
  }

  // Calçadas elevadas (superfície y = 0.25)
  if (absZ > 7.0 && absZ <= 12.0 && absX < 28.0) {
    return 0.25;
  }

  return 0.0;
}

// Posições dos postes de luz para colisão
const lampPoles = [
  { x: -20, z: -7.4 },
  { x: -6,  z: -7.4 },
  { x: 8,   z: -7.4 },
  { x: 22,  z: -7.4 },
  { x: -12, z: 7.4 },
  { x: 2,   z: 7.4 },
  { x: 16,  z: 7.4 }
];

// Posições das estruturas das traves de madeira
const goalPosts = [
  // Trave Esquerda (x = -18.5)
  { x: -18.5, z: -1.75, radius: 0.18 },
  { x: -18.5, z: 1.75,  radius: 0.18 },
  { x: -19.7, z: -1.75, radius: 0.18 },
  { x: -19.7, z: 1.75,  radius: 0.18 },

  // Trave Direita (x = 18.5)
  { x: 18.5, z: -1.75, radius: 0.18 },
  { x: 18.5, z: 1.75,  radius: 0.18 },
  { x: 19.7, z: -1.75, radius: 0.18 },
  { x: 19.7, z: 1.75,  radius: 0.18 }
];

export function updatePlayer(player) {
  const keys = getKeys();
  const { yaw } = getRotation();

  // Direções de movimento relativas à câmera
  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
  const right = new THREE.Vector3(-Math.cos(yaw), 0, Math.sin(yaw));

  let speed = 0.18;
  if (keys['shift']) speed = 0.28; // Correr com Shift

  const move = new THREE.Vector3();
  if (keys['w']) move.add(forward);
  if (keys['s']) move.sub(forward);
  if (keys['a']) move.sub(right);
  if (keys['d']) move.add(right);

  if (move.lengthSq() > 0) {
    move.normalize().multiplyScalar(speed);
    player.position.add(move);
    player.lookAt(player.position.clone().add(move));
  }

  // --- TRATAMENTO DE COLISÕES DO JOGADOR ---

  // 1. Limites do mapa e Muros das Casas
  const absX = Math.abs(player.position.x);
  if (absX < 28.0) {
    if (player.position.z < -11.0) player.position.z = -11.0;
    if (player.position.z > 11.0) player.position.z = 11.0;
  } else {
    if (player.position.z < -24.0) player.position.z = -24.0;
    if (player.position.z > 24.0) player.position.z = 24.0;
  }

  if (player.position.x < -34.0) player.position.x = -34.0;
  if (player.position.x > 34.0) player.position.x = 34.0;

  // 2. Colisão com Postes de Iluminação
  lampPoles.forEach(pole => {
    const dx = player.position.x - pole.x;
    const dz = player.position.z - pole.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const minDist = playerRadius + 0.25;
    if (dist < minDist && dist > 0) {
      const overlap = minDist - dist;
      player.position.x += (dx / dist) * overlap;
      player.position.z += (dz / dist) * overlap;
    }
  });

  // 3. Colisão do Jogador com a Estrutura Completa das Travinhas
  // Trave Esquerda (x entre -19.9 e -18.3)
  if (player.position.x < -18.3 && player.position.x > -20.0) {
    if (Math.abs(player.position.z) <= 1.95) {
      // Se vem de trás
      if (player.position.x < -18.5) player.position.x = -20.0;
      // Se vem das laterais
      if (Math.abs(player.position.z) > 1.6) {
        player.position.z = Math.sign(player.position.z) * 1.95;
      }
    }
  }

  // Trave Direita (x entre 18.3 e 19.9)
  if (player.position.x > 18.3 && player.position.x < 20.0) {
    if (Math.abs(player.position.z) <= 1.95) {
      if (player.position.x > 18.5) player.position.x = 20.0;
      if (Math.abs(player.position.z) > 1.6) {
        player.position.z = Math.sign(player.position.z) * 1.95;
      }
    }
  }

  // 4. Altura do terreno (Subir na calçada / voltar pra rua)
  const targetY = getTerrainHeight(player.position.x, player.position.z);
  player.position.y += (targetY - player.position.y) * 0.3; // Transição suave

  return move;
}

export function updateBall(ball, player, playerMove) {
  const keys = getKeys();

  // Gravidade
  ballVelocity.y -= 0.014;

  // Atualiza posição da bola
  ball.position.add(ballVelocity);

  // Fricção de rolamento
  ballVelocity.x *= 0.978;
  ballVelocity.z *= 0.978;

  // Pega a altura do terreno abaixo da bola (rua vs calçada)
  const terrainY = getTerrainHeight(ball.position.x, ball.position.z);
  const minBallY = terrainY + ballRadius;

  // --- COLISÃO E REBATE DA BOLA NO MEIO-FIO (GUIA DA CALÇADA) ---
  const absZ = Math.abs(ball.position.z);
  const absX = Math.abs(ball.position.x);

  // Se a bola está vindo da rua em direção à calçada (|Z| batendo na guia a 7.0)
  if (absX < 28.0 && absZ >= 6.75 && absZ <= 7.25) {
    // Se a bola estiver abaixo da borda superior da calçada (não saltou alto o suficiente)
    if (ball.position.y < 0.38) {
      const vZSpeed = Math.abs(ballVelocity.z);
      if (vZSpeed > 0.03) {
        // A BOLA BATE NO MEIO-FIO E VOLTA QUICANDO!
        ballVelocity.y += 0.08 + vZSpeed * 0.45; // Impulso vertical para quicar!
        ballVelocity.z *= -0.65;                 // Rebate para trás em direção ao meio da rua
        ball.position.z = Math.sign(ball.position.z) * 6.7; // Empurra de volta para a rua
      }
    }
  }

  // Quique da bola no chão / superfície da calçada
  if (ball.position.y <= minBallY) {
    ball.position.y = minBallY;
    if (Math.abs(ballVelocity.y) > 0.04) {
      ballVelocity.y = -ballVelocity.y * 0.52; // Quique com amortecimento
    } else {
      ballVelocity.y = 0;
    }
  }

  // Limites do mapa (muros das casas)
  if (absX < 28.0) {
    if (ball.position.z < -11.2) { ball.position.z = -11.2; ballVelocity.z *= -0.8; }
    if (ball.position.z > 11.2)  { ball.position.z = 11.2;  ballVelocity.z *= -0.8; }
  }
  if (ball.position.x < -34.0) { ball.position.x = -34.0; ballVelocity.x *= -0.8; }
  if (ball.position.x > 34.0)  { ball.position.x = 34.0;  ballVelocity.x *= -0.8; }

  // --- COLISÃO DA BOLA COM O JOGADOR (CONDUÇÃO E CHUTE) ---
  const dx = ball.position.x - player.position.x;
  const dz = ball.position.z - player.position.z;
  const dist2D = Math.sqrt(dx * dx + dz * dz);
  const minDist = playerRadius + ballRadius;

  if (dist2D < minDist) {
    const overlap = minDist - dist2D;
    const nx = dist2D > 0 ? dx / dist2D : 1;
    const nz = dist2D > 0 ? dz / dist2D : 0;

    // Afasta a bola do jogador
    ball.position.x += nx * overlap;
    ball.position.z += nz * overlap;

    // Condução/Impulso
    const pushSpeed = 0.13;
    ballVelocity.x += nx * pushSpeed + (playerMove ? playerMove.x * 0.5 : 0);
    ballVelocity.z += nz * pushSpeed + (playerMove ? playerMove.z * 0.5 : 0);

    // Chute com a barra de ESPAÇO
    if (keys[' ']) {
      const { yaw } = getRotation();
      const kickDir = new THREE.Vector3(Math.sin(yaw), 0.38, Math.cos(yaw)).normalize();
      ballVelocity.copy(kickDir.multiplyScalar(0.48));
    }
  }

  // --- COLISÃO COMPLETA DA BOLA COM AS TRAVINHAS DE MADEIRA ---

  // 1. Postes de madeira verticais e traseiros (colisão circular)
  goalPosts.forEach(post => {
    const pdx = ball.position.x - post.x;
    const pdz = ball.position.z - post.z;
    const pdist = Math.sqrt(pdx * pdx + pdz * pdz);
    const pmin = ballRadius + post.radius;

    if (pdist < pmin && pdist > 0) {
      const poverlap = pmin - pdist;
      const pnx = pdx / pdist;
      const pnz = pdz / pdist;
      ball.position.x += pnx * poverlap;
      ball.position.z += pnz * poverlap;

      const dot = ballVelocity.x * pnx + ballVelocity.z * pnz;
      if (dot < 0) {
        ballVelocity.x -= 1.65 * dot * pnx;
        ballVelocity.z -= 1.65 * dot * pnz;
        ballVelocity.y += 0.05; // Pequeno salto ao bater na trave
      }
    }
  });

  // 2. Colisão da Bola com o Travessão (Altura y = 1.4)
  if (ball.position.y + ballRadius >= 1.35 && ball.position.y - ballRadius <= 1.48) {
    // Travessão Esquerdo
    if (Math.abs(ball.position.x - (-18.5)) < 0.25 && Math.abs(ball.position.z) <= 1.75) {
      ballVelocity.y = -Math.abs(ballVelocity.y) * 0.7 - 0.05; // Bate no travessão e desce!
      ballVelocity.x *= -0.7;
    }
    // Travessão Direito
    if (Math.abs(ball.position.x - 18.5) < 0.25 && Math.abs(ball.position.z) <= 1.75) {
      ballVelocity.y = -Math.abs(ballVelocity.y) * 0.7 - 0.05;
      ballVelocity.x *= -0.7;
    }
  }

  // 3. Colisão com a Rede e Fundo da Travinha (Rede Segura a Bola / Colisão de Fora)
  // Trave Esquerda
  if (ball.position.x < -18.5 && ball.position.x > -19.9) {
    if (Math.abs(ball.position.z) < 1.70) {
      // Bola DENTRO do gol: o fundo da rede amortece e segura a bola
      if (ball.position.x <= -19.4) {
        ball.position.x = -19.4;
        ballVelocity.x *= -0.3;
        ballVelocity.z *= 0.5;
      }
    } else if (Math.abs(ball.position.z) <= 1.95) {
      // Bola bate na rede lateral por FORA
      ball.position.z = Math.sign(ball.position.z) * 1.95;
      ballVelocity.z *= -0.7;
    }
  } else if (ball.position.x <= -19.9 && ball.position.x > -20.5 && Math.abs(ball.position.z) <= 1.8) {
    // Bola bate nas costas do gol por FORA
    ball.position.x = -20.5;
    ballVelocity.x *= -0.7;
  }

  // Trave Direita
  if (ball.position.x > 18.5 && ball.position.x < 19.9) {
    if (Math.abs(ball.position.z) < 1.70) {
      // Bola DENTRO do gol
      if (ball.position.x >= 19.4) {
        ball.position.x = 19.4;
        ballVelocity.x *= -0.3;
        ballVelocity.z *= 0.5;
      }
    } else if (Math.abs(ball.position.z) <= 1.95) {
      // Bola bate na rede lateral por FORA
      ball.position.z = Math.sign(ball.position.z) * 1.95;
      ballVelocity.z *= -0.7;
    }
  } else if (ball.position.x >= 19.9 && ball.position.x < 20.5 && Math.abs(ball.position.z) <= 1.8) {
    // Bola bate nas costas do gol por FORA
    ball.position.x = 20.5;
    ballVelocity.x *= -0.7;
  }
}

export function updateCamera(camera, player) {
  const { yaw } = getRotation();

  const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw)).normalize();
  const cameraOffset = new THREE.Vector3(-2, 3.5, -4);
  const rotatedOffset = cameraOffset.clone().applyAxisAngle(new THREE.Vector3(0,1,0), yaw);

  camera.position.copy(player.position).add(rotatedOffset);

  const target = player.position.clone().add(forward.multiplyScalar(20));
  target.y += 2;
  camera.lookAt(target);
}
