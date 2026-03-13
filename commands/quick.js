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

        // 2. Commit (reusing the commit command logic)
        // We call commit with options { yes: false } to allow review, 
        // or we could ask the user if they want to auto-commit.
        // For "quick", let's assume they might want to review the message first, 
        // but we'll use the existing commit logic which handles staged changes.
        await commit();

        // Check if commit was successful by checking if there are still staged changes 
        // (or if the last command succeeded). Since commit() handles its own errors, 
        // we should check if we actually committed.
        
        // 3. Get Branches
        const spinner = ora('Fetching branches...').start();
        const branchesRaw = execSync('git branch --all').toString();
        spinner.stop();

        const branches = branchesRaw
            .split('\n')
            .map(b => b.trim().replace('* ', ''))
            .filter(b => b && !b.includes('->'));

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
                // If it's a remote branch, we might need to handle it differently, 
                // but usually 'git push origin branchname' works.
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
