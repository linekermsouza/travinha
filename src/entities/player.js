import * as THREE from 'three';

export function createPlayer() {
  const group = new THREE.Group();

  // Tronco
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 0.5),
    new THREE.MeshPhongMaterial({ color: 0x0000ff })
  );
  body.position.set(0, 2, 0);
  group.add(body);

  // Cabeça redonda e suave
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64), // mais segmentos = esfera lisa
    new THREE.MeshPhongMaterial({ color: 0xffcc99 })
  );
  head.position.set(0, 3.5, 0);
  group.add(head);

  // Braços
  const armMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), armMaterial);
  leftArm.position.set(-0.8, 2.5, 0);
  group.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), armMaterial);
  rightArm.position.set(0.8, 2.5, 0);
  group.add(rightArm);

  // Pernas
  const legMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.5, 0.4), legMaterial);
  leftLeg.position.set(-0.3, 0.75, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.5, 0.4), legMaterial);
  rightLeg.position.set(0.3, 0.75, 0);
  group.add(rightLeg);

  // Ajustes finais
  group.scale.set(1, 0.5, 1);   // altura pela metade
  group.position.set(-10, 0, 0); // desloca mais para a esquerda

  return group;
}
