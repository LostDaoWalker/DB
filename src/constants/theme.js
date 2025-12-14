export const THEME = {
  name: 'Cozy Critters',
  color: 0x8bd3dd,
  accent: 0xf9bc60,
  danger: 0xf45d48,
  ok: 0x43aa8b,
  ink: 0x1f2937,
};

export function cozyLine() {
  const lines = [
    'The lanterns glow softly in the forest…',
    'A warm breeze carries the scent of pine.',
    'Tiny pawprints criss-cross the mossy path.',
    'Somewhere nearby, a kettle whistles gently.',
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}
