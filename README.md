# 🤖 GitCom: AI-Powered Git Commits

### 🏆 The Intelligent CLI for Professional Commit Messages
**Optimize your workflow, save tokens, and never write a boring commit message again.**

  🌐 [Website](https://github.com/suryansh1440/Gitcom) | 📄 [Documentation](#-usage) | 🎥 [Demo](#-usage)

![GitCom Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Platform Support](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

[Deutsch] | [Español] | [Français] | [日本語] | [한국어] | [Português] | [Русский] | [English]

---

### 🥳 Updates
- **2026/03/13**: **v1.0.0 Released!** Support for OpenAI, Gemini, and Ollama.
- **2026/03/13**: Implemented **Hybrid Token Optimization** to reduce LLM costs by up to 90%.
- **2026/03/13**: Added support for **ES Modules** and modern JavaScript syntax.

---

## 💡 Introduction
Welcome to **GitCom**, a high-performance CLI tool designed to automate the most tedious part of your development cycle: writing commit messages. GitCom analyzes your staged changes and generates professional, conventional commit messages using state-of-the-art AI.

### Why GitCom?
- **Cost Efficient**: Intelligent diff summarization ensures you only send what's necessary.
- **Provider Agnostic**: Use OpenAI, Google Gemini, or run locally with Ollama.
- **Developer First**: Built with Node.js, ESM, and a focus on speed.

---

## 🎯 Features
- ⚡ **Hybrid Strategy**: Uses `git diff --stat` for large changes to minimize token usage.
- 🛠️ **Multi-Provider**: Seamless switching between cloud and local AI models.
- 🧹 **Noise Filtering**: Automatically ignores lockfiles and build artifacts.
- 🚀 **Interactive UI**: Edit and confirm messages before they hit your history.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: >= 18.x
- **Git**: Installed and initialized in your repo.

### Installation
Clone the repository and link it globally:
```bash
git clone https://github.com/suryansh1440/Gitcom.git
cd Gitcom
npm link
```

### API Configuration
Run the setup wizard to configure your preferred provider:
```bash
gitcom init
```
*   **Gemini**: Enter your Google AI Studio key.
*   **OpenAI**: Enter your OpenAI API key.
*   **Ollama**: Ensure Ollama is running at `http://localhost:11434`.

---

## 🚀 Usage

### Generate a Commit
Stage your changes first, then run `gitcom`:
```bash
git add .
gitcom commit
```
*Or simply:*
```bash
gitcom
```

### Manage Settings
Update your provider or model anytime:
```bash
gitcom settings
```

### Reset Configuration
Wipe all data and keys:
```bash
gitcom --reset
```

### Check Version
```bash
gitcom -v
```

---

## 🧠 Token Optimization Details
GitCom uses a **3-Stage Pipeline** to keep your bills low:

1.  **Stage 1 (Filter)**: Ignores `package-lock.json`, `dist/`, and other noise.
2.  **Stage 2 (Analyze)**: Calculates the size of your changes.
3.  **Stage 3 (Optimize)**: 
    - **Large Changes (>300 lines)**: Sends `file-list` + `--stat` summary.
    - **Small Changes**: Sends a cleaned code-only diff snippet.

---

## 🤝 Acknowledgements
- **Commander.js**: The backbone of our CLI.
- **Inquirer**: For the beautiful interactive prompts.
- **Ora**: For the smooth loading animations.

---

## 💬 License
Distributed under the ISC License. See `LICENSE` for more information.

---
<p align="center">Made with ❤️ for Developers</p>
