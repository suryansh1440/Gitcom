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
- **2026/03/13**: **v1.0.0 Released!** Full support for OpenAI, Gemini, and Ollama.
- **2026/03/13**: **Global Distribution**: Ready to install via `npm install -g gitcom`.
- **2026/03/13**: **Auto-Commit Mode**: Added `-y, --yes` flag for instant AI commits.
- **2026/03/13**: **Token Optimization**: Hybrid diff analysis reduces LLM costs by up to 90%.

---

## 💡 Introduction
Welcome to **GitCom**, a high-performance CLI tool designed to automate the most tedious part of your development cycle: writing commit messages. GitCom analyzes your staged changes and generates clean, verb-based commit messages instantly.

### Why GitCom?
- **Descriptive & Direct**: Generates meaningful messages starting with strong verbs (e.g., "add", "fix", "refactor").
- **Cost Efficient**: Intelligent diff summarization ensures you only send what's necessary.
- **Provider Agnostic**: Use OpenAI, Google Gemini, or run locally with Ollama.
- **Minimalist UI**: Clean terminal interface with no verbose instructions or noise.
- 🚀 **Interactive UI**: Edit and confirm messages before they hit your history.
- ⚙️ **Quick Config**: Easily switch providers and models via `gitcom config`.

---

## 🎯 Features
- ⚡ **Hybrid Strategy**: Uses `git diff --stat` for large changes to minimize token usage.
- 📐 **Compact Output**: All messages are single-line and optimized for git history readability.
- 🚀 **Auto-Commit**: Use `-y` or `--yes` to skip confirmation and commit instantly.
- 🛠️ **Integrated Setup**: One-stop wizard for Provider, API Key, and Model selection.
- 🧹 **Noise Filtering**: Automatically ignores lockfiles, build artifacts, and binaries.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js**: >= 18.x
- **Git**: Installed and initialized in your repo.

### Installation
Install globally using npm:
```bash
npm install -g gitcom
```
*Note: You can also run it without installing via `npx gitcom`.*

### API Configuration
Run the setup wizard to configure your preferred provider:
```bash
gitcom init
```
*   **Integrated Flow**: Choose your provider, enter your key (secure entry), and pick a model from the list.
*   **Key Security**: API keys are entered securely (hidden on-screen) and stored locally.

---

## 🚀 Usage

### Generate a Commit
Stage your changes first, then run `gitcom`:
```bash
git add .
gitcom commit
```

### Auto-Commit (Fast Mode)
Skip the confirmation and commit instantly:
```bash
gitcom commit -y
```

*Or simply run the default command:*
```bash
gitcom
```

### Manage Configuration
Update your provider or model anytime:
```bash
gitcom config
```

### Help & Commands
Check all available options:
```bash
gitcom --help
# or
gitcom -h
```

### Reset Configuration
Wipe all data and keys:
```bash
gitcom --reset
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
- **@inquirer/prompts**: For the robust and secure interactive interface.
- **Ora**: For the smooth loading animations.

---

## 💬 License
Distributed under the ISC License. See `LICENSE` for more information.

---
<p align="center">Made with ❤️ for Developers</p>
