import { execSync, exec } from 'child_process';
import { select, confirm } from '@inquirer/prompts';
import ora from 'ora';
import commit from './commit.js';
import logger from '../utils/logger.js';

async function quick() {
    try {
        // 1. Git Add .
        logger.info('Staging all changes...');
        execSync('git add .');

        // 2. Commit
        const commitResult = await commit({ quiet: true });
        
        // If commit failed (error or cancellation), stop here
        if (commitResult === false) {
            return;
        }

        // If no changes were staged, check if we have any un-pushed commits
        if (commitResult === 'no_changes') {
            try {
                // Check if current branch is ahead of its upstream
                const status = execSync('git status -sb').toString();
                const isAhead = status.includes('[ahead');
                
                if (!isAhead) {
                    logger.info('No changes to commit and branch is up-to-date with remote. Nothing to push.');
                    return;
                }
                logger.info('No new changes staged, but un-pushed commits found. Proceeding to push...');
            } catch (error) {
                // If no upstream is set, we might not know if we are ahead. 
                // In this case, we'll proceed to branch selection anyway.
            }
        }

        // 3. Get Branches
        const spinner = ora('Fetching branches...').start();
        let branches = [];
        try {
            const branchesRaw = execSync('git branch --all').toString();
            branches = branchesRaw
                .split('\n')
                .map(b => b.trim().replace('* ', ''))
                .filter(b => b && !b.includes('->'));
        } catch (error) {
            spinner.stop();
            logger.error('Failed to fetch branches. Are you in a git repository?');
            return;
        }
        spinner.stop();

        if (branches.length === 0) {
            logger.warn('No branches found.');
            return;
        }

        // 4. Select Branch
        const targetBranch = await select({
            message: 'Select branch to push to:',
            choices: branches.map(b => ({ name: b, value: b })),
            instructions: false
        });

        // 5. Push
        const shouldPush = await confirm({
            message: `Push to ${targetBranch}?`,
            default: true,
            instructions: false
        });

        if (shouldPush) {
            const pushSpinner = ora(`Pushing to ${targetBranch}...`).start();
            try {
                const cleanBranch = targetBranch.replace('remotes/origin/', '');
                execSync(`git push origin ${cleanBranch}`, { stdio: 'inherit' });
                pushSpinner.stop();
                logger.success(`Successfully pushed to ${cleanBranch}! 🚀`);
            } catch (error) {
                pushSpinner.stop();
                logger.error(`Push failed: ${error.message}`);
            }
        } else {
            logger.info('Push cancelled.');
        }

    } catch (error) {
        if (error.name === 'ExitPromptError') {
            logger.info('\nCancelled by user.');
        } else {
            logger.error(`Quick flow failed: ${error.message}`);
        }
    }
}

export default quick;
