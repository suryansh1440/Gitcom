import { select } from '@inquirer/prompts';
import config from '../config/config.js';
import logger from '../utils/logger.js';
import { setupProvider } from './init.js';

async function settings() {
    logger.info('Current Settings:');
    const allConfig = config.store;
    const currentProvider = config.get('provider');

    Object.entries(allConfig).forEach(([key, value]) => {
        if (key.includes('key')) {
            logger.dim(`${key}: ********`);
        } else {
            logger.dim(`${key}: ${value}`);
        }
    });

    try {
        const action = await select({
            message: 'What would you like to do?',
            instructions: false,
            choices: [
                { name: `Update Provider & Model (Current: ${currentProvider})`, value: 'provider' },
                { name: 'Exit', value: 'exit' }
            ]
        });

        if (action === 'exit') return;

        if (action === 'provider') {
            await setupProvider();
            logger.success('Settings updated successfully.');
        }
    } catch (error) {
        if (error.name === 'ExitPromptError') {
            // User cancelled
        } else {
            logger.error(`Error: ${error.message}`);
        }
    }
}

export default settings;
