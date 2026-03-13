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
                Analyze the following changes and generate a concise, descriptive commit message.

                Rules:
                1. Use specific verbs (e.g., "implement", "add", "refactor", "fix", "update", "remove", "configure").
                2. Avoid generic descriptions like "enhance functionality" or "update code" or "make changes".
                3. Be specific about WHAT changed (e.g., "add Gemini provider" instead of "enhance providers").
                4. Keep the message COMPACT (under 70 characters) and on a SINGLE LINE.
                5. Return ONLY the message string. No quotes, no prefix.

                Context:
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
