import { createCanvas } from '@napi-rs/canvas';

function bar(ctx, x, y, w, h, pct, fg, bg) {
  ctx.fillStyle = bg;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = fg;
  ctx.fillRect(x, y, Math.max(0, Math.min(w, Math.floor(w * pct))), h);
}

const COLORS = {
  win: 'rgba(67,170,139,0.95)',
  loss: 'rgba(244,93,72,0.95)',
  textPrimary: 'rgba(255,255,255,0.92)',
  textSecondary: 'rgba(255,255,255,0.75)',
  textTertiary: 'rgba(255,255,255,0.55)',
  panelBg: 'rgba(255,255,255,0.06)',
  healthBg: 'rgba(255,255,255,0.10)',
  healthPlayer: '#8bd3dd',
  healthEnemy: '#f9bc60',
};

export function renderBattleCard({ title, player, enemy, winner }) {
  const W = 800;
  const H = 450;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#0f172a');
  g.addColorStop(1, '#1f2937');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Soft glow panels
  ctx.fillStyle = COLORS.panelBg;
  ctx.fillRect(40, 90, 330, 280);
  ctx.fillRect(430, 90, 330, 280);

  // Title
  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = '700 28px sans-serif';
  ctx.fillText(title, 40, 55);

  const winnerText = winner === 'player' ? 'You win' : 'You rest and try again';
  ctx.fillStyle = winner === 'player' ? COLORS.win : COLORS.loss;
  ctx.font = '600 18px sans-serif';
  ctx.fillText(winnerText, 40, 78);

  // Player side
  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = '700 22px sans-serif';
  ctx.fillText(`${player.name}  Lv.${player.level}`, 60, 130);
  ctx.font = '500 16px sans-serif';
  ctx.fillStyle = COLORS.textSecondary;
  ctx.fillText(`HP ${player.hp}/${player.maxHp}`, 60, 160);
  bar(ctx, 60, 175, 290, 14, player.maxHp ? player.hp / player.maxHp : 0, COLORS.healthPlayer, COLORS.healthBg);

  // Enemy side
  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = '700 22px sans-serif';
  ctx.fillText(`${enemy.name}  Lv.${enemy.level}`, 450, 130);
  ctx.font = '500 16px sans-serif';
  ctx.fillStyle = COLORS.textSecondary;
  ctx.fillText(`HP ${enemy.hp}/${enemy.maxHp}`, 450, 160);
  bar(ctx, 450, 175, 290, 14, enemy.maxHp ? enemy.hp / enemy.maxHp : 0, COLORS.healthEnemy, COLORS.healthBg);

  // Cozy footer
  ctx.fillStyle = COLORS.textTertiary;
  ctx.font = '500 14px sans-serif';
  ctx.fillText('Cozy Critters • autobattle', 40, 420);

  return canvas.toBuffer('image/png');
}
