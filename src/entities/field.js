import * as THREE from 'three';

export function createField() {
  const group = new THREE.Group();

  // Chão de grama
  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 20),
    new THREE.MeshPhongMaterial({ color: 0x2e7d32 })
  );
  grass.rotation.x = -Math.PI / 2;
  group.add(grass);

  // Linhas brancas
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const thick = 0.12;
  const y = 0.01;

  // Linhas de fundo
  const lineLeft = new THREE.Mesh(new THREE.PlaneGeometry(thick, 20), lineMat);
  lineLeft.rotation.x = -Math.PI / 2;
  lineLeft.position.set(-20, y, 0);
  group.add(lineLeft);

  const lineRight = new THREE.Mesh(new THREE.PlaneGeometry(thick, 20), lineMat);
  lineRight.rotation.x = -Math.PI / 2;
  lineRight.position.set(20, y, 0);
  group.add(lineRight);

  // Linhas de lateral
  const lineTop = new THREE.Mesh(new THREE.PlaneGeometry(40, thick), lineMat);
  lineTop.rotation.x = -Math.PI / 2;
  lineTop.position.set(0, y, -10);
  group.add(lineTop);

  const lineBottom = new THREE.Mesh(new THREE.PlaneGeometry(40, thick), lineMat);
  lineBottom.rotation.x = -Math.PI / 2;
  lineBottom.position.set(0, y, 10);
  group.add(lineBottom);

  // Linha central
  const lineCenter = new THREE.Mesh(new THREE.PlaneGeometry(thick, 20), lineMat);
  lineCenter.rotation.x = -Math.PI / 2;
  lineCenter.position.set(0, y, 0);
  group.add(lineCenter);

  // Círculo central
  const centerCircle = new THREE.Mesh(new THREE.RingGeometry(3, 3 + thick, 32), lineMat);
  centerCircle.rotation.x = -Math.PI / 2;
  centerCircle.position.set(0, y, 0);
  group.add(centerCircle);

  return group;
}
