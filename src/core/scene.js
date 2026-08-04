import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10,20,10);
  scene.add(light);

  return scene;
}
