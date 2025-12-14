import { startCommand } from './commands/start.js';
import { profileCommand } from './commands/profile.js';
import { battleCommand } from './commands/battle.js';
import { chooseAnimalComponent } from './components/choose-animal.js';
import { battleAgainComponent } from './components/battle-again.js';

export const registry = {
  commands: new Map([
    [startCommand.data.name, startCommand],
    [profileCommand.data.name, profileCommand],
    [battleCommand.data.name, battleCommand],
  ]),
  components: new Map([
    [chooseAnimalComponent.customId, chooseAnimalComponent],
    [battleAgainComponent.customId, battleAgainComponent],
  ]),
};

export function allCommandsJson() {
  return [startCommand.data.toJSON(), profileCommand.data.toJSON(), battleCommand.data.toJSON()];
}
