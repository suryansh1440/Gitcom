import ora from 'ora';
import { confirm, input } from '@inquirer/prompts';
import { execSync } from 'child_process';
import { getOptimizedContext } from '../git/diff.js';
import AIProviderFactory from '../providers/factory.js';
import logger from '../utils/logger.js';

async function commit(options = {}) {
    try {
        const context = await getOptimizedContext();

        if (context.files.length === 0) {
            if (!options.quiet) {
                logger.warn('No staged changes found. Use "git add" to stage changes first.');
            }
            return 'no_changes';
        }

        const spinner = ora('Analyzing changes and generating message...').start();
        
        try {
            const provider = AIProviderFactory.getProvider();
            const message = await provider.generateCommitMessage(context);
            spinner.stop();

            if (options.yes) {
                const escapedMessage = message.replace(/"/g, '\\"');
                execSync(`git commit -m "${escapedMessage}"`, { stdio: 'inherit' });
                logger.success('Changes committed instantly! 🚀');
                return true;
            }

            logger.info('Suggested Commit Message:');
            logger.dim('--------------------------');
            console.log(message);
            logger.dim('--------------------------');

            const isConfirmed = await confirm({
                message: 'Use this commit message?',
                instructions: false,
                default: true
            });

            if (isConfirmed) {
                const finalMessage = await input({
                    message: 'Edit message (optional):',
                    default: message
                });

                if (!finalMessage.trim()) {
                    logger.warn('Commit cancelled: Empty commit message.');
                    return false;
                }

                // Escape double quotes for shell command
                const escapedMessage = finalMessage.replace(/"/g, '\\"');
                execSync(`git commit -m "${escapedMessage}"`, { stdio: 'inherit' });
                logger.success('Changes committed successfully!');
                return true;
            } else {
                logger.info('Commit cancelled.');
                return false;
            }
        } catch (error) {
            spinner.stop();
            if (error.name === 'ExitPromptError') {
                logger.info('Cancelled by user.');
            } else {
                logger.error(`Failed to generate message: ${error.message}`);
            }
            return false;
        }
    } catch (error) {
        logger.error(`Error: ${error.message}`);
        return false;
    }
}

export default commit;
