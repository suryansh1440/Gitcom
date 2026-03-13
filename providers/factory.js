import OpenAIProvider from './openai.js';
import GeminiProvider from './gemini.js';
import OllamaProvider from './ollama.js';
import config from '../config/config.js';

class AIProviderFactory {
    static getProvider() {
        const providerName = config.get('provider');
        
        switch (providerName) {
            case 'openai':
                return new OpenAIProvider();
            case 'gemini':
                return new GeminiProvider();
            case 'ollama':
                return new OllamaProvider();
            default:
                throw new Error(`Unsupported provider: ${providerName}`);
        }
    }
}

export default AIProviderFactory;
