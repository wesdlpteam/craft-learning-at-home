# Curriculum sources and adaptations

This picker adapts all 2,678 content-description records in the ACARA Version 9.0 Foundation–Year 10 learning-area workbook downloaded on 9 September 2026.

| Learning area | Descriptions |
| --- | ---: |
| English | 284 |
| Mathematics | 240 |
| Science | 152 |
| Humanities and Social Sciences | 333 |
| Health and Physical Education | 97 |
| Technologies | 124 |
| The Arts | 165 |
| Languages | 1,283 |

There are 34 subject/framework entries, 54 course variants and 256 course-level combinations. All 18 language/framework entries available in this source are included. Language frameworks are not complete vocabulary or grammar courses for every named language. The official learning-area structure and supported year bands are preserved. Primary HASS remains combined; Years 7–10 subjects are separate.

The picker does not reproduce elaborations or achievement standards. General capabilities and cross-curriculum priorities are not separate selectable libraries. Senior secondary and optional Year 10A content are outside this release.

## Source and attribution

© Australian Curriculum, Assessment and Reporting Authority (ACARA) 2010 to present, unless otherwise indicated.

Source: [ACARA curriculum workbook](https://www.australiancurriculum.edu.au/content/dam/en/curriculum/ac-version-9/downloads/curriculum-workbook.xlsx), downloaded from the [Australian Curriculum website](https://www.australiancurriculum.edu.au/downloads) on 9 September 2026, and modified.

The curriculum material is licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). See [ACARA copyright and terms of use](https://www.australiancurriculum.edu.au/copyright-and-terms-of-use).

This app is not affiliated with or endorsed by ACARA. Users should assess its suitability and alignment with their learning needs. Schools may teach topics in different orders. Check the official curriculum for full requirements and current information.

Source workbook SHA-256: 41cd241b6f8df05d096db68150615c117a0acf0af48eab00b3c64e21c218d213.

## What was changed

Each description has an authored plain-language label. Related labels are organised into familiar topic groups. Where curricula share the same learning target across languages or adjacent years, labels are reused while keeping each original description and course identity. Scripts, signed language and language-framework distinctions remain in the data and prompt.

The labels are navigation aids, not exhaustive replacements for official descriptions. The exact official description, code, level, sequence, pathway, version and source are preserved. Source spelling and identifier anomalies are retained, rather than silently inventing corrected official references.

A selected skill adds its official context to the copied prompt. Editing the generated difficulty removes that reference. Choosing an earlier topic level preserves the actual school year. An uncertain language course produces general help rather than an inferred pathway.

For Auslan, the prompt distinguishes signed language from spoken language and requests verified examples. For frameworks and local cultural content, it requests teacher- or community-approved materials rather than invented vocabulary or permissions. Practical learning is supported through suitable explanations or planning aids, without claiming that a webpage replaces supervised performance.

## Maintenance and verification

Runtime data is bundled as static JSON under curriculum/, with curriculum/manifest.js describing supported subjects, courses and levels. These files load from the same website only as needed; answers are not included in requests. There is no external curriculum API, live synchronisation or API key.

Authored labels are in scripts/labels/. Existing verified Maths labels remain in curriculum-maths.js as the build input and regression baseline; that file is not loaded by the app.

To reproduce:
1. Download the linked workbook to output/curriculum/source.xlsx.
2. Run scripts/extract-curriculum.py with Python and openpyxl.
3. Run python scripts/build-curriculum.py.
4. Run node scripts/check-curriculum.cjs.
5. Perform the browser checks described in QA.md before publication.

scripts/source-audit.json records a fingerprint of every official source record. A changed source fails the build and requires deliberate review. Reconcile changed coverage, review affected labels, update the audit after source review, and increment the shared release value and script query versions. Never publish mixed asset versions.
