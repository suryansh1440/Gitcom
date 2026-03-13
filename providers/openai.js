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
                    content: `You are a professional Git commit generator. 
                    Analyze the provided file list and diff to generate a concise, descriptive commit message.
                    
                    Rules:
                    1. Use specific verbs (e.g., "implement", "add", "refactor", "fix", "update", "remove", "configure").
                    2. Avoid generic descriptions like "enhance functionality" or "update code" or "make changes".
                    3. Be specific about WHAT changed (e.g., "add Gemini provider" instead of "enhance providers").
                    4. Return ONLY the message string. No quotes, no prefix like "Commit:".`
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
