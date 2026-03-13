import { OpenAI } from 'openai';
import config from '../config/config.js';

class OpenAIProvider {
    constructor() {
        this.apiKey = config.get('openai_key');
        if (!this.apiKey) {
            throw new Error('OpenAI API key not found. Run "gitcom init" to setup.');
        }
        this.client = new OpenAI({ apiKey: this.apiKey });
    }

    async generateCommitMessage(context) {
        const { files, stat, diff, summaryOnly } = context;
        const model = config.get('model') || 'gpt-4o-mini';
        
        let promptContent = `Files changed:\n${files.join('\n')}\n\nSummary:\n${stat}`;
        if (!summaryOnly && diff) {
            promptContent += `\n\nChanges (partial diff):\n${diff}`;
        }

        const response = await this.client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional Git commit generator. Generate a concise commit message based on the provided file list and diff. Return ONLY the message, no quotes or prefix. Follow conventional commits if possible.'
                },
                {
                    role: 'user',
                    content: promptContent
                }
            ],
            max_tokens: 100
        });

        return response.choices[0].message.content.trim();
    }
}

export default OpenAIProvider;
