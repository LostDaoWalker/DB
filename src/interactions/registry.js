import { startCommand } from './commands/start.js';
import { profileCommand } from './commands/profile.js';
import { battleCommand } from './commands/battle.js';
import { foodchainCommand } from './commands/foodchain.js';
import { cooldownCommand } from './commands/cooldown.js';
import { statsCommand } from './commands/stats.js';
import { resetCommand } from './commands/reset.js';
import { chooseAnimalComponent } from './components/choose-animal.js';
import { battleAgainComponent } from './components/battle-again.js';
import { resetConfirmHandler } from './components/reset-confirm.js';
import { resetCancelHandler } from './components/reset-cancel.js';

export const registry = {
  commands: new Map([
    [startCommand.data.name, startCommand],
    [profileCommand.data.name, profileCommand],
    [battleCommand.data.name, battleCommand],
    [foodchainCommand.data.name, foodchainCommand],
    [cooldownCommand.data.name, cooldownCommand],
    [statsCommand.data.name, statsCommand],
    [resetCommand.data.name, resetCommand],
  ]),
  components: new Map([
    [chooseAnimalComponent.customId, chooseAnimalComponent],
    [battleAgainComponent.customId, battleAgainComponent],
    ['reset_confirm', resetConfirmHandler],
    ['reset_cancel', resetCancelHandler],
  ]),
};

export function allCommandsJson() {
  return [
    startCommand.data.toJSON(),
    profileCommand.data.toJSON(),
    battleCommand.data.toJSON(),
    foodchainCommand.data.toJSON(),
    cooldownCommand.data.toJSON(),
    statsCommand.data.toJSON(),
    resetCommand.data.toJSON()
  ];
}
