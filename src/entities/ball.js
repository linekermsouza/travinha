import * as THREE from 'three';

export function createBall() {
  const radius = 0.35; // bola menor
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshPhongMaterial({ color: 0xffffff })
  );
  ball.position.set(0, radius, 0); // altura = raio
  return ball;
}
