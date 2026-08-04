import * as THREE from 'three';

export function createGoal(side = 'left') {
  const group = new THREE.Group();
  const width = 4;      // Largura da travinha
  const height = 1.8;    // Altura da travinha
  const depth = 1.2;     // Profundidade da travinha
  const pipeRadius = 0.06;

  const pipeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 90 });
  const netMaterial = new THREE.MeshBasicMaterial({
    color: 0xeeeeee,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  });

  // O sinal da profundidade da travinha (para trás do campo)
  const dir = side === 'left' ? -1 : 1;
  const backX = dir * depth;

  // 1. Trave esquerda (Z negativo)
  const leftPost = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, height, 16),
    pipeMaterial
  );
  leftPost.position.set(0, height / 2, -width / 2);
  group.add(leftPost);

  // 2. Trave direita (Z positivo)
  const rightPost = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, height, 16),
    pipeMaterial
  );
  rightPost.position.set(0, height / 2, width / 2);
  group.add(rightPost);

  // 3. Travessão (Barra superior frontal)
  const crossbar = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, width, 16),
    pipeMaterial
  );
  crossbar.rotation.x = Math.PI / 2;
  crossbar.position.set(0, height, 0);
  group.add(crossbar);

  // 4. Estrutura Traseira
  // Barra inferior traseira
  const backBase = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, width, 16),
    pipeMaterial
  );
  backBase.rotation.x = Math.PI / 2;
  backBase.position.set(backX, pipeRadius, 0);
  group.add(backBase);

  // Barra superior traseira
  const backTop = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, width, 16),
    pipeMaterial
  );
  backTop.rotation.x = Math.PI / 2;
  backTop.position.set(backX, height, 0);
  group.add(backTop);

  // Tubos de profundidade (Base Esquerda e Direita)
  const baseLeft = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, depth, 16),
    pipeMaterial
  );
  baseLeft.rotation.z = Math.PI / 2;
  baseLeft.position.set(backX / 2, pipeRadius, -width / 2);
  group.add(baseLeft);

  const baseRight = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, depth, 16),
    pipeMaterial
  );
  baseRight.rotation.z = Math.PI / 2;
  baseRight.position.set(backX / 2, pipeRadius, width / 2);
  group.add(baseRight);

  // Tubos de profundidade (Topo Esquerdo e Direito)
  const topLeft = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, depth, 16),
    pipeMaterial
  );
  topLeft.rotation.z = Math.PI / 2;
  topLeft.position.set(backX / 2, height, -width / 2);
  group.add(topLeft);

  const topRight = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, depth, 16),
    pipeMaterial
  );
  topRight.rotation.z = Math.PI / 2;
  topRight.position.set(backX / 2, height, width / 2);
  group.add(topRight);

  // Postes traseiros verticais
  const backPostLeft = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, height, 16),
    pipeMaterial
  );
  backPostLeft.position.set(backX, height / 2, -width / 2);
  group.add(backPostLeft);

  const backPostRight = new THREE.Mesh(
    new THREE.CylinderGeometry(pipeRadius, pipeRadius, height, 16),
    pipeMaterial
  );
  backPostRight.position.set(backX, height / 2, width / 2);
  group.add(backPostRight);

  // 5. Redes (Traseira, Superior, Laterais)
  const backNet = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height, 12, 6),
    netMaterial
  );
  backNet.rotation.y = side === 'left' ? Math.PI / 2 : -Math.PI / 2;
  backNet.position.set(backX, height / 2, 0);
  group.add(backNet);

  const topNet = new THREE.Mesh(
    new THREE.PlaneGeometry(depth, width, 4, 12),
    netMaterial
  );
  topNet.rotation.x = Math.PI / 2;
  topNet.position.set(backX / 2, height, 0);
  group.add(topNet);

  const sideNetLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(depth, height, 4, 6),
    netMaterial
  );
  sideNetLeft.position.set(backX / 2, height / 2, -width / 2);
  group.add(sideNetLeft);

  const sideNetRight = new THREE.Mesh(
    new THREE.PlaneGeometry(depth, height, 4, 6),
    netMaterial
  );
  sideNetRight.position.set(backX / 2, height / 2, width / 2);
  group.add(sideNetRight);

  // Posicionar a travinha na linha de fundo correspondente
  const posX = side === 'left' ? -19.6 : 19.6;
  group.position.set(posX, 0, 0);

  return group;
}
