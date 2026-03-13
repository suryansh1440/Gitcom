import { select, password, input } from '@inquirer/prompts';
import config from '../config/config.js';
import logger from '../utils/logger.js';

const PROVIDERS = [
  { name: 'Gemini (Recommended)', value: 'gemini' },
  { name: 'OpenAI', value: 'openai' },
  { name: 'Ollama (Local LLM)', value: 'ollama' }
];

const MODELS = {
  gemini: [
    { name: 'Gemini 1.5 Flash (Fast)', value: 'gemini-1.5-flash' },
    { name: 'Gemini 1.5 Pro (Powerful)', value: 'gemini-1.5-pro' }
  ],
  openai: [
    { name: 'GPT-4o mini (Recommended)', value: 'gpt-4o-mini' },
    { name: 'GPT-4o (Most Capable)', value: 'gpt-4o' },
    { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' }
  ],
  ollama: []
};

async function setupProvider(providerValue) {
  const provider = providerValue || await select({
    message: 'Select AI provider:',
    instructions: false,
    choices: PROVIDERS,
    default: config.get('provider') || 'gemini'
  });

  config.set('provider', provider);

  if (provider === 'openai' || provider === 'gemini') {
    const keyName = `${provider}_key`;
    const existingKey = config.get(keyName);
    const key = await password({
      message: `Enter ${provider === 'openai' ? 'OpenAI' : 'Gemini'} API Key:`,
      instructions: false,
      validate: (val) => {
        if (existingKey && val.trim() === '') return true;
        return val.trim().length > 0 || 'Key cannot be empty';
      }
    });

    if (key.trim() !== '') {
      config.set(keyName, key.trim());
    }

    const model = await select({
      message: `Select ${provider === 'openai' ? 'OpenAI' : 'Gemini'} Model:`,
      instructions: false,
      choices: MODELS[provider],
      default: config.get('model') || MODELS[provider][0].value
    });
    config.set('model', model);

    logger.success(`${provider === 'openai' ? 'OpenAI' : 'Gemini'} configured.`);
  } else if (provider === 'ollama') {
    const url = await input({
      message: 'Enter Ollama URL:',
      default: config.get('ollama_url') || 'http://localhost:11434'
    });
    const model = await input({
      message: 'Enter Ollama model name:',
      default: config.get('ollama_model') || 'llama3'
    });
    config.set('ollama_url', url);
    config.set('ollama_model', model);
    logger.success('Ollama configured.');
  }
}

async function init() {
  try {
    await setupProvider();
    logger.success('GitCom setup complete! You can now run "gitcom commit".');
  } catch (error) {
    if (error.name === 'ExitPromptError') {
      logger.warn('Setup cancelled.');
    } else {
      logger.error(`An error occurred: ${error.message}`);
    }
  }
}

export { setupProvider };
export default init;
