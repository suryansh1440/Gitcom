import axios from 'axios';
import config from '../config/config.js';

class OllamaProvider {
    constructor() {
        this.baseUrl = config.get('ollama_url') || 'http://localhost:11434';
    }

    async generateCommitMessage(context) {
        const { files, stat, diff, summaryOnly } = context;
        const model = config.get('ollama_model') || 'llama3';
        
        let promptContent = `Files changed:\n${files.join('\n')}\n\nSummary:\n${stat}`;
        if (!summaryOnly && diff) {
            promptContent += `\n\nChanges (partial diff):\n${diff}`;
        }

        try {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: model,
                prompt: `You are a professional Git commit generator. 
                Generate a concise commit message based on the following changes.
                Return ONLY the message, no quotes or prefix. Follow conventional commits.

                ${promptContent}`,
                stream: false
            });

            return response.data.response.trim();
        } catch (error) {
            throw new Error(`Ollama connection failed: ${error.message}. Ensure Ollama is running at ${this.baseUrl}`);
        }
    }
}

export default OllamaProvider;
