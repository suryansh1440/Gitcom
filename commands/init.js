import { select, password, input } from '@inquirer/prompts';
import config from '../config/config.js';
import logger from '../utils/logger.js';

async function init() {
    logger.info('Initializing GitCom setup...');

    try {
        const provider = await select({
            message: 'Select AI provider:',
            choices: [
                { name: 'Gemini (Recommended)', value: 'gemini' },
                { name: 'OpenAI', value: 'openai' },
                { name: 'Ollama (Local LLM)', value: 'ollama' }
            ],
            default: config.get('provider') || 'gemini'
        });

        config.set('provider', provider);

        if (provider === 'openai') {
            const key = await password({
                message: 'Enter OpenAI API Key (masked):',
                validate: (val) => val.trim().length > 0 || 'Key cannot be empty'
            });
            config.set('openai_key', key.trim());
            config.set('model', 'gpt-4o-mini');
            logger.success('OpenAI provider configured.');
        } else if (provider === 'gemini') {
            const key = await password({
                message: 'Enter Gemini API Key (masked):',
                validate: (val) => val.trim().length > 0 || 'Key cannot be empty'
            });
            config.set('gemini_key', key.trim());
            config.set('model', 'gemini-1.5-flash');
            logger.success('Gemini provider configured.');
        } else if (provider === 'ollama') {
            const url = await input({
                message: 'Enter Ollama URL:',
                default: 'http://localhost:11434'
            });
            const model = await input({
                message: 'Enter Ollama model name:',
                default: 'llama3'
            });
            config.set('ollama_url', url);
            config.set('ollama_model', model);
            logger.success('Ollama provider configured.');
        }

        logger.success('GitCom setup complete! You can now run "gitcom commit".');
    } catch (error) {
        if (error.name === 'ExitPromptError') {
            logger.warn('Setup cancelled.');
        } else {
            logger.error(`An error occurred: ${error.message}`);
        }
    }
}

export default init;
