export const THEME = {
  name: 'Animal Kingdom',
  color: 0x8b5a2b,
  accent: 0xd2691e,
  danger: 0xdc143c,
  ok: 0x228b22,
  ink: 0x1f2937,
};

export function primalLine() {
  const lines = [
    'The wild calls...',
    'Only the strong survive.',
    'Nature\'s law prevails.',
    'The hunt continues.',
    'Survival demands strength.',
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}
