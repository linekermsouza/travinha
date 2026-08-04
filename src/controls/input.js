const keys = {};

export function setupKeyboard() {
  document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
  document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
}

export function getKeys() {
  return keys;
}
