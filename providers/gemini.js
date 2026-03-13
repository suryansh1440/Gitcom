import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config.js';

class GeminiProvider {
    constructor() {
        this.apiKey = config.get('gemini_key');
        if (!this.apiKey) {
            throw new Error('Gemini API key not found. Run "gitcom init" to setup.');
        }
        this.genAI = new GoogleGenerativeAI(this.apiKey);
    }

    async generateCommitMessage(context) {
        const { files, stat, diff, summaryOnly } = context;
        const modelName = config.get('model') || 'gemini-1.5-flash';
        const model = this.genAI.getGenerativeModel({ model: modelName });

        let promptContent = `Files changed:\n${files.join('\n')}\n\nSummary:\n${stat}`;
        if (!summaryOnly && diff) {
            promptContent += `\n\nChanges (partial diff):\n${diff}`;
        }

        const prompt = `You are a professional Git commit generator. 
        Analyze the following changes and generate a concise, descriptive commit message.

        Rules:
        1. Use specific verbs (e.g., "implement", "add", "refactor", "fix", "update", "remove", "configure").
        2. Avoid generic descriptions like "enhance functionality" or "update code" or "make changes".
        3. Be specific about WHAT changed (e.g., "add Gemini provider" instead of "enhance providers").
        4. Return ONLY the message string. No quotes, no prefix.

        Context:
        ${promptContent}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    }
}

export default GeminiProvider;
