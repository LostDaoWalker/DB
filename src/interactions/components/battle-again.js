import { battleCommand } from '../commands/battle.js';

export const battleAgainComponent = {
  customId: 'battle_again:v1',

  async execute(interaction) {
    if (!interaction.isButton()) return;
    // Reuse the same flow as /battle, but keep it cozy + ephemeral.
    await battleCommand.execute(interaction);
  },
};
