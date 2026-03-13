import ora from 'ora';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { getOptimizedContext } from '../git/diff.js';
import AIProviderFactory from '../providers/factory.js';
import logger from '../utils/logger.js';

async function commit() {
    try {
        const context = await getOptimizedContext();

        if (context.files.length === 0) {
            logger.warn('No staged changes found. Use "git add" to stage changes first.');
            return;
        }

        const spinner = ora('Analyzing changes and generating message...').start();
        
        try {
            const provider = AIProviderFactory.getProvider();
            const message = await provider.generateCommitMessage(context);
            spinner.stop();

            logger.info('Suggested Commit Message:');
            logger.dim('--------------------------');
            console.log(message);
            logger.dim('--------------------------');

            const { confirm } = await inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Use this commit message?',
                    default: true
                }
            ]);

            if (confirm) {
                const { finalMessage } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'finalMessage',
                        message: 'Edit message (optional):',
                        default: message
                    }
                ]);

                // Escape double quotes for shell command
                const escapedMessage = finalMessage.replace(/"/g, '\\"');
                execSync(`git commit -m "${escapedMessage}"`, { stdio: 'inherit' });
                logger.success('Changes committed successfully!');
            } else {
                logger.info('Commit cancelled.');
            }
        } catch (error) {
            spinner.stop();
            logger.error(`Failed to generate message: ${error.message}`);
        }
    } catch (error) {
        logger.error(`Error: ${error.message}`);
    }
}

export default commit;
