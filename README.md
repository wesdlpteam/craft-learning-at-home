# CRAFT Learning at Home

A simple prompt builder for parents, carers and students. Choose who is using it, describe a learning difficulty, optionally personalise the activity, and copy a prompt into Claude to create an interactive artifact.

No curriculum knowledge, build step, dependencies or API keys are needed. Answers are held only in the current page; nothing is sent to Claude automatically.

## Run locally

From this directory, run `python -m http.server 8766 --bind 127.0.0.1`, then open http://127.0.0.1:8766.

## Publish

Serve `index.html` with any static website host. This repository is separate from the teacher version at https://github.com/wesdlpteam/craft-classroom-app-builder.

## Verification

See `QA.md` for the browser checks and evidence. Claude artifact generation itself requires using Claude and is not performed by this builder.

## Maths curriculum picker

Parents and students choose a school year, a topic and a plain-language skill. The picker covers 240 ACARA Version 9.0 Mathematics content descriptions for Foundation–Year 10. An optional topic-level selector supports earlier foundations without changing the school year. Other subjects, unknown years and Years 11–12 use general suggestions.

Selected skills add the official description and reference to the generated Claude prompt. Editing that difficulty text removes the reference. No API keys, curriculum network calls or automatic artifact publication are required.

See [curriculum sources and adaptations](CURRICULUM-SOURCES.md). Run structural checks with:

```sh
node scripts/check-curriculum.cjs
```
