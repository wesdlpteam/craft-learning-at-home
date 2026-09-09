# CRAFT Learning at Home

A prompt builder for parents, carers and students. Choose a school year, subject, topic and plain-language skill, optionally personalise the activity, then copy the prompt into Claude to create an interactive artifact for review.

## Coverage

All eight ACARA Version 9.0 learning areas, Foundation–Year 10: 2,678 content descriptions, 34 subjects/frameworks and all 18 language/framework entries in the source workbook. Language courses retain their primary/secondary starting points and learner pathways. Subjects with two-year bands show the correct band for the selected school year.

An earlier-level option supports foundations while retaining the actual school year. Unknown years, senior secondary and uncertain language courses can still use general or custom descriptions.

## Privacy and publishing

No curriculum knowledge, runtime dependencies, API keys or backend are required. Answers stay in the current page; nothing is sent to Claude automatically. The page loads static subject data from its own website when needed. Claude instructions explicitly leave artifact publishing and sharing to the user.

The website remains separate from the teacher app at https://github.com/wesdlpteam/craft-classroom-app-builder.

## Run locally

Run python -m http.server 8766 --bind 127.0.0.1 in this directory, then open http://127.0.0.1:8766. Use HTTP because the picker loads static JSON files.

## Data and checks

See [sources, scope and rebuild instructions](CURRICULUM-SOURCES.md) and [QA results](QA.md).

Run node scripts/check-curriculum.cjs to check all source fingerprints, labels, courses, year bands and the original Maths behavior. The source extraction utility needs openpyxl; the website and validation script need no installed packages.

To publish, serve this directory with a static website host. Keep the data release and script URL versions in sync to prevent returning browsers from loading mismatched files.
