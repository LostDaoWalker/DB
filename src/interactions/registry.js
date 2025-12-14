import { startCommand } from './commands/start.js';
import { profileCommand } from './commands/profile.js';
import { battleCommand } from './commands/battle.js';
import { foodchainCommand } from './commands/foodchain.js';
import { cooldownCommand } from './commands/cooldown.js';
import { statsCommand } from './commands/stats.js';
import { chooseAnimalComponent } from './components/choose-animal.js';
import { battleAgainComponent } from './components/battle-again.js';
import { gameplayMenuHandler } from './components/gameplay-menu.js';
import { changeAnimalHandler } from './components/change-animal.js';

export const registry = {
  commands: new Map([
    [startCommand.data.name, startCommand],
    [profileCommand.data.name, profileCommand],
    [battleCommand.data.name, battleCommand],
    [foodchainCommand.data.name, foodchainCommand],
    [cooldownCommand.data.name, cooldownCommand],
    [statsCommand.data.name, statsCommand],
  ]),
  components: new Map([
    [chooseAnimalComponent.customId, chooseAnimalComponent],
    [battleAgainComponent.customId, battleAgainComponent],
    ['gameplay_menu', gameplayMenuHandler],
    ['change_animal', changeAnimalHandler],
  ]),
};

export function allCommandsJson() {
  return [
    startCommand.data.toJSON(),
    profileCommand.data.toJSON(),
    battleCommand.data.toJSON(),
    foodchainCommand.data.toJSON(),
    cooldownCommand.data.toJSON(),
    statsCommand.data.toJSON()
  ];
}
