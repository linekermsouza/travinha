import * as THREE from 'three';

export function createGoal(side = 'left') {
  const group = new THREE.Group();
  const width = 3.5;       // Largura da travinha de rua
  const height = 1.4;      // Altura da travinha de rua
  const depth = 1.2;       // Profundidade da base da travinha
  const beamSize = 0.12;   // Espessura do caibro de madeira

  // Material de madeira rústica de rua
  const woodMaterial = new THREE.MeshLambertMaterial({
    color: 0x7a4a21
  });

  const woodSupportMaterial = new THREE.MeshLambertMaterial({
    color: 0x5a3517
  });

  // Material da rede artesanal de barbante/nylon
  const netMaterial = new THREE.MeshBasicMaterial({
    color: 0xeeeeee,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide
  });

  const dir = side === 'left' ? -1 : 1;
  const backX = dir * depth;

  // 1. Postes frontais verticais de madeira (Cateto Vertical)
  const leftPost = new THREE.Mesh(
    new THREE.BoxGeometry(beamSize, height, beamSize),
    woodMaterial
  );
  leftPost.position.set(0, height / 2, -width / 2);
  group.add(leftPost);

  const rightPost = new THREE.Mesh(
    new THREE.BoxGeometry(beamSize, height, beamSize),
    woodMaterial
  );
  rightPost.position.set(0, height / 2, width / 2);
  group.add(rightPost);

  // 2. Travessão superior de madeira
  const crossbar = new THREE.Mesh(
    new THREE.BoxGeometry(beamSize, beamSize, width + beamSize),
    woodMaterial
  );
  crossbar.position.set(0, height - beamSize / 2, 0);
  group.add(crossbar);

  // 3. Caibros da base no chão (Cateto Horizontal)
  const baseLeft = new THREE.Mesh(
    new THREE.BoxGeometry(depth, beamSize, beamSize),
    woodSupportMaterial
  );
  baseLeft.position.set(backX / 2, beamSize / 2, -width / 2);
  group.add(baseLeft);

  const baseRight = new THREE.Mesh(
    new THREE.BoxGeometry(depth, beamSize, beamSize),
    woodSupportMaterial
  );
  baseRight.position.set(backX / 2, beamSize / 2, width / 2);
  group.add(baseRight);

  // Trave traseira no chão ligando a parte de trás
  const backFloor = new THREE.Mesh(
    new THREE.BoxGeometry(beamSize, beamSize, width),
    woodSupportMaterial
  );
  backFloor.position.set(backX, beamSize / 2, 0);
  group.add(backFloor);

  // 4. Madeiras Diagonais Laterais (Hipotenusa do Triângulo Retângulo)
  // Conecta o topo do poste (0, height) até o pé traseiro no chão (backX, 0)
  const hypotenuseLength = Math.sqrt(depth * depth + height * height);
  const angleZ = Math.atan2(depth, height);

  // Sinal corrigido para alinhar perfeitamente com a inclinação da rede!
  const diagRotationZ = side === 'left' ? -angleZ : angleZ;

  const diagLeft = new THREE.Mesh(
    new THREE.BoxGeometry(beamSize, hypotenuseLength, beamSize),
    woodSupportMaterial
  );
  diagLeft.position.set(backX / 2, height / 2, -width / 2);
  diagLeft.rotation.z = diagRotationZ;
  group.add(diagLeft);

  const diagRight = new THREE.Mesh(
    new THREE.BoxGeometry(beamSize, hypotenuseLength, beamSize),
    woodSupportMaterial
  );
  diagRight.position.set(backX / 2, height / 2, width / 2);
  diagRight.rotation.z = diagRotationZ;
  group.add(diagRight);

  // 5. Redes Ajustadas ao Triângulo Retângulo
  // a) Redes Laterais em formato de TRIÂNGULO RETÂNGULO
  const triangleShape = new THREE.Shape();
  triangleShape.moveTo(0, 0);
  triangleShape.lineTo(0, height);
  triangleShape.lineTo(backX, 0);
  triangleShape.closePath();

  const sideNetGeo = new THREE.ShapeGeometry(triangleShape);

  const sideNetLeft = new THREE.Mesh(sideNetGeo, netMaterial);
  sideNetLeft.position.set(0, 0, -width / 2);
  group.add(sideNetLeft);

  const sideNetRight = new THREE.Mesh(sideNetGeo, netMaterial);
  sideNetRight.position.set(0, 0, width / 2);
  group.add(sideNetRight);

  // b) Rede Traseira Inclinada acompanhando exatamente a hipotenusa
  const backNetGroup = new THREE.Group();
  const backNetMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(width, hypotenuseLength, 12, 8),
    netMaterial
  );
  backNetGroup.add(backNetMesh);
  backNetGroup.position.set(backX / 2, height / 2, 0);
  backNetGroup.rotation.y = side === 'left' ? Math.PI / 2 : -Math.PI / 2;
  backNetMesh.rotation.x = angleZ;
  group.add(backNetGroup);

  // Posiciona as travinhas no final da rua
  const posX = side === 'left' ? -18.5 : 18.5;
  group.position.set(posX, 0, 0);

  return group;
}
