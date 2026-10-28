// Gives every category its own consistent accent colour (hue in degrees).
const HUES = [221, 262, 168, 24, 330, 190, 142, 350];

export function hueFor(text) {
  const s = String(text || 'general').trim().toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 9973;
  return HUES[h % HUES.length];
}
