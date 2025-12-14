import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { getEnv } from '../src/config/env.js';
import { allCommandsJson } from '../src/interactions/registry.js';

const env = getEnv();
const rest = new REST({ version: '10' }).setToken(env.DISCORD_TOKEN);

async function main() {
  const body = allCommandsJson();

  if (env.GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(env.CLIENT_ID, env.GUILD_ID), { body });
    // eslint-disable-next-line no-console
    console.log(`Registered ${body.length} guild commands in ${env.GUILD_ID}.`);
    return;
  }

  await rest.put(Routes.applicationCommands(env.CLIENT_ID), { body });
  // eslint-disable-next-line no-console
  console.log(`Registered ${body.length} global commands.`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
