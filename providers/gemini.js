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
        Generate a concise commit message based on the following changes.
        Return ONLY the message, no quotes or prefix. Follow conventional commits.

        ${promptContent}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    }
}

export default GeminiProvider;
