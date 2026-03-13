import { select, input } from '@inquirer/prompts';
import config from '../config/config.js';
import logger from '../utils/logger.js';

async function settings() {
    logger.info('Current Settings:');
    const allConfig = config.store;
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
            choices: [
                { name: 'Change AI Provider', value: 'provider' },
                { name: 'Update Model Name', value: 'model' },
                { name: 'Exit', value: 'exit' }
            ]
        });

        if (action === 'exit') return;

        if (action === 'provider') {
            const provider = await select({
                message: 'Select AI provider:',
                choices: [
                    { name: 'Gemini (Recommended)', value: 'gemini' },
                    { name: 'OpenAI', value: 'openai' },
                    { name: 'Ollama (Local LLM)', value: 'ollama' }
                ]
            });
            config.set('provider', provider);
            logger.success(`Provider switched to ${provider}. Run "gitcom init" to update keys if needed.`);
        } else if (action === 'model') {
            const model = await input({
                message: 'Enter new model name:',
                default: config.get('model') || 'gemini-1.5-flash'
            });
            config.set('model', model);
            logger.success(`Model updated to ${model}`);
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
