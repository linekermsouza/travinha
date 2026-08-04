import * as THREE from 'three';

export function createField() {
  const field = new THREE.Mesh(
    new THREE.PlaneGeometry(40, 20),
    new THREE.MeshBasicMaterial({ color: 0x006400 })
  );
  field.rotation.x = -Math.PI / 2;
  return field;
}
