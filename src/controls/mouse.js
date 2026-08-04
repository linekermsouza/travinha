let yaw = 0;
let pitch = 0;

export function setupMouse() {
  document.body.addEventListener('click', () => {
    document.body.requestPointerLock();
  });

  document.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement === document.body) {
      yaw -= event.movementX * 0.002;
      pitch -= event.movementY * 0.002;
      pitch = Math.max(-Math.PI/4, Math.min(Math.PI/4, pitch));
    }
  });
}

export function getRotation() {
  return { yaw, pitch };
}
