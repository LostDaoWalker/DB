import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import fs from 'node:fs';
import { logger } from '../logger.js';

const execAsync = promisify(exec);

export async function setupAutoGit() {
  // Set up Git hooks for auto-commit on changes
  const gitHookPath = path.join(process.cwd(), '.git', 'hooks', 'post-commit');

  if (!fs.existsSync(path.dirname(gitHookPath))) {
    fs.mkdirSync(path.dirname(gitHookPath), { recursive: true });
  }

  // Create post-commit hook that triggers push
  const hookContent = `#!/bin/sh
# Auto-push after commit
git push origin main --force-with-lease 2>/dev/null || true
`;

  fs.writeFileSync(gitHookPath, hookContent);
  fs.chmodSync(gitHookPath, '755');

  logger.info('Git auto-push hook installed');
}

export async function autoCommitAndPush(message = 'Auto-commit') {
  try {
    // Check if there are changes
    const { stdout: status } = await execAsync('git status --porcelain');
    if (!status.trim()) {
      return; // No changes to commit
    }

    // Add all changes
    await execAsync('git add .');

    // Commit with message
    await execAsync(`git commit -m "${message}" --allow-empty`);

    // Push to main branch
    await execAsync('git push origin main --force-with-lease');

    logger.info('Auto-committed and pushed changes to GitHub');

  } catch (err) {
    logger.error({ err }, 'Failed to auto-commit and push');
  }
}

// Auto-commit on application exit
process.on('exit', () => {
  autoCommitAndPush('Auto-commit on exit').catch(() => {});
});

// Auto-commit every 5 minutes if there are changes
setInterval(() => {
  autoCommitAndPush('Periodic auto-commit').catch(() => {});
}, 5 * 60 * 1000);
