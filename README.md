# CRAFT Learning at Home

A simple prompt builder for parents, carers and students. Choose who is using it, describe a learning difficulty, optionally personalise the activity, and copy a prompt into Claude to create an interactive artifact.

No curriculum knowledge, build step, dependencies or API keys are needed. Answers are held only in the current page; nothing is sent to Claude automatically.

## Run locally

From this directory, run `python -m http.server 8766 --bind 127.0.0.1`, then open http://127.0.0.1:8766.

## Publish

Serve `index.html` with any static website host. This repository is separate from the teacher version at https://github.com/wesdlpteam/craft-classroom-app-builder.

## Verification

See `QA.md` for the browser checks and evidence. Claude artifact generation itself requires using Claude and is not performed by this builder.
