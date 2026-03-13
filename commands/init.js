import inquirer from 'inquirer';
import config from '../config/config.js';
import logger from '../utils/logger.js';

async function init() {
    logger.info('Initializing GitCom setup...');

    try {
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'provider',
                message: 'Select AI provider:',
                choices: [
                    { name: 'Gemini (Recommended)', value: 'gemini' },
                    { name: 'OpenAI', value: 'openai' },
                    { name: 'Ollama (Local LLM)', value: 'ollama' }
                ],
                default: config.get('provider') || 'gemini'
            }
        ]);

        config.set('provider', answers.provider);

        if (answers.provider === 'openai') {
            const { key } = await inquirer.prompt([
                {
                    type: 'password',
                    name: 'key',
                    message: 'Enter OpenAI API Key (masked):',
                    validate: (input) => input.trim().length > 0 || 'Key cannot be empty'
                }
            ]);
            config.set('openai_key', key.trim());
            config.set('model', 'gpt-4o-mini');
            logger.success('OpenAI provider configured.');
        } else if (answers.provider === 'gemini') {
            const { key } = await inquirer.prompt([
                {
                    type: 'password',
                    name: 'key',
                    message: 'Enter Gemini API Key (masked):',
                    validate: (input) => input.trim().length > 0 || 'Key cannot be empty'
                }
            ]);
            config.set('gemini_key', key.trim());
            config.set('model', 'gemini-1.5-flash');
            logger.success('Gemini provider configured.');
        } else if (answers.provider === 'ollama') {
            const { url, model } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'url',
                    message: 'Enter Ollama URL:',
                    default: 'http://localhost:11434'
                },
                {
                    type: 'input',
                    name: 'model',
                    message: 'Enter Ollama model name:',
                    default: 'llama3'
                }
            ]);
            config.set('ollama_url', url);
            config.set('ollama_model', model);
            logger.success('Ollama provider configured.');
        }

        logger.success('GitCom setup complete! You can now run "gitcom commit".');
    } catch (error) {
        if (error.isTtyError) {
            logger.error('Prompt could not be rendered in the current environment.');
        } else {
            logger.error(`An error occurred: ${error.message}`);
        }
    }
}

export default init;
