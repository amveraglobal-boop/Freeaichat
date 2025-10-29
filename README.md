# Advanced Chat — Gemini & DeepSeek (OpenRouter)

This minimal app lets you query the OpenRouter-hosted models (Google Gemini 2.5 Pro and DeepSeek V3.2 Exp) and provides large checkboxes, download-as-TXT, and share-via-email buttons. It's simple to deploy to Railway.

## Features
- Select one or both models (`google/gemini-2.5-pro`, `deepseek/deepseek-v3.2-exp`) using big, beautiful checkboxes.
- Send a prompt to each selected model.
- Download the response as a TXT file.
- Share the response via email (mailto link).

## Requirements
- Node.js 18+ (Railway supports node runtimes)
- An OpenRouter API key

## Environment
Set the environment variable:

- `OPENROUTER_API_KEY` — your OpenRouter API key

On Railway, set `OPENROUTER_API_KEY` in the project environment variables.

## Run locally
1. Install dependencies:

```powershell
npm install
```

2. Set your environment variable (PowerShell):

```powershell
$env:OPENROUTER_API_KEY = "your_key_here"
npm start
```

3. Open http://localhost:3000

## Railway deployment
1. Push this repository to a Git provider (GitHub).
2. Create a new Railway project and link the repo.
3. In Railway project variables, set `OPENROUTER_API_KEY` to your key.
4. Railway will detect `package.json` and run `npm install` then `npm start`.

Notes: The server listens on `process.env.PORT`, which Railway provides automatically.

## Files
- `server.js` — Express server and OpenRouter proxy
- `public/index.html` — Frontend UI
- `public/app.js` — Frontend JS
- `package.json` — dependencies and start script

## TODO / Next steps
- Add request throttling and rate-limit handling.
- Add better error rendering: show OpenRouter error details when available.
- Add server-side caching for repeated prompts.

Enjoy! If you'd like, I can add a GitHub Actions workflow or directly prepare the repo for Railway (create a Git remote and push) — tell me if you want that next.