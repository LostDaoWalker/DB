import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const srcDir = resolve(__dirname, 'src');

let botProcess = null;

function startBot() {
  if (botProcess) {
    botProcess.kill();
  }

  console.log('\n[LAUNCHER] Starting bot...\n');

  botProcess = spawn('node', ['src/index.js'], {
    stdio: 'inherit',
    cwd: __dirname,
  });

  botProcess.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.log(`[LAUNCHER] Bot exited with code ${code}`);
    }
  });
}

function setupWatcher() {
  console.log('[LAUNCHER] Watching for file changes...\n');

  let debounceTimeout;

  watch(srcDir, { recursive: true }, (eventType, filename) => {
    if (!filename || filename.startsWith('.')) return;

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      console.log(`[LAUNCHER] Detected change in ${filename}, restarting bot...`);
      startBot();
    }, 200);
  });
}

// Start the bot and watcher
startBot();
setupWatcher();

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n[LAUNCHER] Shutting down...');
  if (botProcess) {
    botProcess.kill();
  }
  process.exit(0);
});
