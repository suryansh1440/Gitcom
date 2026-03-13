import inquirer from 'inquirer';
import config from '../config/config.js';
import logger from '../utils/logger.js';

async function settings() {
    logger.info('Current Settings:');
    console.table(config.store);

    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['Change Provider', 'Update API Key', 'Change Model', 'Exit']
        }
    ]);

    if (action === 'Change Provider') {
        const { provider } = await inquirer.prompt([
            {
                type: 'list',
                name: 'provider',
                message: 'Select AI provider:',
                choices: ['openai', 'gemini', 'ollama']
            }
        ]);
        config.set('provider', provider);
        logger.success(`Provider changed to ${provider}`);
    } else if (action === 'Update API Key') {
        const provider = config.get('provider');
        const keyName = provider === 'openai' ? 'openai_key' : 'gemini_key';
        
        const { key } = await inquirer.prompt([
            {
                type: 'password',
                name: 'key',
                message: `Enter new API key for ${provider}:`
            }
        ]);
        config.set(keyName, key);
        logger.success('API key updated');
    } else if (action === 'Change Model') {
        const { model } = await inquirer.prompt([
            {
                type: 'input',
                name: 'model',
                message: 'Enter model name:',
                default: config.get('model')
            }
        ]);
        config.set('model', model);
        logger.success(`Model updated to ${model}`);
    }
}

export default settings;
