import Conf from 'conf';
import chalk from 'chalk';
import path from 'path';
import os from 'os';

const schema = {
	provider: {
		type: 'string',
		enum: ['openai', 'gemini', 'ollama'],
		default: 'openai'
	},
	openai_key: {
		type: 'string',
		default: ''
	},
	gemini_key: {
		type: 'string',
		default: ''
	},
	model: {
		type: 'string',
		default: 'gpt-4o-mini'
	},
	ollama_model: {
		type: 'string',
		default: 'llama3'
	},
	ollama_url: {
		type: 'string',
		default: 'http://localhost:11434'
	}
};

const config = new Conf({ 
    projectName: 'gitcom-nodejs',
    schema,
    cwd: path.join(os.homedir(), '.gitcom')
});

export default config;
