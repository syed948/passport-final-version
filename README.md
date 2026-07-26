# Passport — by CleoHR

Frontline worker verification platform. Static site with one Vercel serverless function.

## What's inside

- **`index.html`** and the other 5 HTML pages — self-contained (CSS and JS inlined)
- **`api/jobs.js`** — Vercel serverless function that calls Groq using the `GROQ_API_KEY` env variable
- **`README.md`** — this file

## Deploy on Vercel

1. Push these files to a GitHub repository (keep the `api/` folder at the root).
2. Import the repo into Vercel.
3. Before clicking Deploy, expand **Environment Variables** and add:
   - **Key:** `GROQ_API_KEY`
   - **Value:** your Groq key from https://console.groq.com/keys
   - **Environments:** check Production, Preview, and Development
4. Click Deploy.

## How the jobs feature works

- Browser calls `/api/jobs` with `{place, role, count}`
- Serverless function reads `GROQ_API_KEY` from env, calls Groq, returns JSON
- Frontend renders the job cards
- If Groq fails or the env var is missing, a built-in fallback keeps the demo working

## Rotate the key any time

Change it at https://console.groq.com/keys and update the value in Vercel → Project Settings → Environment Variables. No code change or redeploy of HTML needed (Vercel picks up new env values on the next deploy — just click "Redeploy" from the Deployments tab).
