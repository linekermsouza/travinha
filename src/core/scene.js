import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  const skyColor = 0x87ceeb;
  scene.background = new THREE.Color(skyColor);
  scene.fog = new THREE.FogExp2(skyColor, 0.012);

  // Luz ambiente para iluminar as sombras
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  // Luz solar direcionada
  const sunLight = new THREE.DirectionalLight(0xfffaed, 1.0);
  sunLight.position.set(20, 35, 15);
  scene.add(sunLight);

  return scene;
}
