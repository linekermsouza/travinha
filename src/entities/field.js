import * as THREE from 'three';

export function createField() {
  const group = new THREE.Group();

  // Dimensões do ambiente de rua
  const streetLength = 80; // Eixo X
  const streetWidth = 14;  // Eixo Z (de z = -7 a z = +7)
  const curbHeight = 0.25;
  const sidewalkWidth = 6;

  // Material de asfalto rústico da rua
  const asphaltMat = new THREE.MeshLambertMaterial({ color: 0x323336 });

  // 1. Asfalto da Rua Principal (Sem nenhuma linha pintada de futebol)
  const mainStreet = new THREE.Mesh(
    new THREE.PlaneGeometry(streetLength, streetWidth),
    asphaltMat
  );
  mainStreet.rotation.x = -Math.PI / 2;
  group.add(mainStreet);

  // 2. Cruzamentos com outras ruas ao longe (Extremidade Esquerda e Direita)
  const crossStreetLeft = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 60),
    asphaltMat
  );
  crossStreetLeft.rotation.x = -Math.PI / 2;
  crossStreetLeft.position.set(-35, 0, 0);
  group.add(crossStreetLeft);

  const crossStreetRight = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 60),
    asphaltMat
  );
  crossStreetRight.rotation.x = -Math.PI / 2;
  crossStreetRight.position.set(35, 0, 0);
  group.add(crossStreetRight);

  // 3. Meio-Fio (Guias de Concreto)
  const curbMat = new THREE.MeshLambertMaterial({ color: 0x999999 });
  const curbGeo = new THREE.BoxGeometry(streetLength - 14, curbHeight, 0.3);

  const curbNorth = new THREE.Mesh(curbGeo, curbMat);
  curbNorth.position.set(0, curbHeight / 2, -streetWidth / 2 - 0.15);
  group.add(curbNorth);

  const curbSouth = new THREE.Mesh(curbGeo, curbMat);
  curbSouth.position.set(0, curbHeight / 2, streetWidth / 2 + 0.15);
  group.add(curbSouth);

  // 4. Calçadas ao longo da rua
  const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0xadaba4 });
  const sidewalkGeo = new THREE.BoxGeometry(streetLength - 14, curbHeight, sidewalkWidth);

  const sidewalkNorth = new THREE.Mesh(sidewalkGeo, sidewalkMat);
  sidewalkNorth.position.set(0, curbHeight / 2, -streetWidth / 2 - sidewalkWidth / 2 - 0.3);
  group.add(sidewalkNorth);

  const sidewalkSouth = new THREE.Mesh(sidewalkGeo, sidewalkMat);
  sidewalkSouth.position.set(0, curbHeight / 2, streetWidth / 2 + sidewalkWidth / 2 + 0.3);
  group.add(sidewalkSouth);

  // 5. Casas e Muros da Vizinhança
  const houseColors = [0xe8d0b5, 0xd0e1fd, 0xd4e2d4, 0xf6dfeb, 0xfff3e0, 0xe2d6c5];
  const roofColors = [0x993d3d, 0x8b4513, 0x733828, 0xb22222];

  function createHouse(x, z, rotationY) {
    const houseGroup = new THREE.Group();
    const width = 6.5;
    const height = 4.5;
    const depth = 6;

    const houseColor = houseColors[Math.floor(Math.abs(x) % houseColors.length)];
    const roofColor = roofColors[Math.floor(Math.abs(x * 3) % roofColors.length)];

    // Fachada da casa
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshLambertMaterial({ color: houseColor })
    );
    body.position.y = height / 2;
    houseGroup.add(body);

    // Telhado de telha colonial/telhado duplo
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(width * 0.75, 2.2, 4),
      new THREE.MeshLambertMaterial({ color: roofColor })
    );
    roof.position.y = height + 1.1;
    roof.rotation.y = Math.PI / 4;
    houseGroup.add(roof);

    // Porta da casa
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.3, 0.1),
      new THREE.MeshLambertMaterial({ color: 0x5a3517 })
    );
    door.position.set(0, 1.15, depth / 2 + 0.05);
    houseGroup.add(door);

    // Janelas
    const windowMat = new THREE.MeshLambertMaterial({ color: 0x607d8b });
    const winLeft = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.1), windowMat);
    winLeft.position.set(-width / 3, height / 2 + 0.5, depth / 2 + 0.05);
    houseGroup.add(winLeft);

    const winRight = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.1), windowMat);
    winRight.position.set(width / 3, height / 2 + 0.5, depth / 2 + 0.05);
    houseGroup.add(winRight);

    // Muro baixo na frente da calçada
    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.5, 1.3, 0.25),
      new THREE.MeshLambertMaterial({ color: 0xd9d9d9 })
    );
    wall.position.set(0, 0.65, depth / 2 + 1.2);
    houseGroup.add(wall);

    houseGroup.position.set(x, 0, z);
    houseGroup.rotation.y = rotationY;
    return houseGroup;
  }

  // Casas Lado Norte (z negativo)
  const housePositionsX = [-25, -17, -9, -1, 7, 15, 23];
  housePositionsX.forEach(x => {
    group.add(createHouse(x, -streetWidth / 2 - sidewalkWidth - 3.5, 0));
  });

  // Casas Lado Sul (z positivo)
  housePositionsX.forEach(x => {
    group.add(createHouse(x, streetWidth / 2 + sidewalkWidth + 3.5, Math.PI));
  });

  // 6. Postes de Luz da Rua
  const poleMat = new THREE.MeshLambertMaterial({ color: 0x555555 });
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff5cc });

  [-20, -6, 8, 22].forEach(x => {
    const pole = new THREE.Group();
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 5.5), poleMat);
    shaft.position.y = 2.75;
    pole.add(shaft);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 1.2), poleMat);
    arm.position.set(0, 5.3, 0.5);
    pole.add(arm);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), lampMat);
    bulb.position.set(0, 5.2, 1.0);
    pole.add(bulb);

    pole.position.set(x, 0, -streetWidth / 2 - 0.4);
    group.add(pole);
  });

  return group;
}
