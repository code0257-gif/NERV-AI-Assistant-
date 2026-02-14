<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1j5lB6_nCnZ1GoX1I3bGYTh404N1hJ6cU

## Run Locally (No API key required)

**Prerequisites:**
- Node.js (for the UI)
- Python 3.10+
- Ollama installed locally with a pulled model (default: `llama3`)

1. Install frontend dependencies:
   `npm install`
2. Install Python dependencies:
   `pip install -r requirements.txt`
3. Pull the local LLM model:
   `ollama pull llama3`
4. Start the desktop assistant:
   `python main.py`

This project runs entirely on a local LLM through Ollama and does **not** require any external API key.
