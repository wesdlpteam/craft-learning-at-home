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


## Senior IB Diploma and VCE — 9 September 2026

Senior release: `20260909-senior-1`. Its catalogue is independent of the unchanged F–10 release.

- IB official subject list: https://ibo.org/globalassets/new-structure/programmes/dp/pdfs/all-dp-subjects-list-en.pdf
- IB public curriculum pages and subject briefs: https://ibo.org/programmes/diploma-programme/curriculum/
- IB school-based/pilot listing: https://ibo.org/programmes/diploma-programme/curriculum/other-dp-subjects-offered-by-the-ib/
- VCAA course index: https://www.vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/vce-study-designs
- VCAA language index: https://www.vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/languages/vce-study-designs-languages
- VCAA 2026 list: https://www.vcaa.vic.edu.au/sites/default/files/2025-12/VCEStudyDesignsList2026.pdf

### Scope and interpretation

All 174 current DP subject entries remaining after explicit discontinued/CP exclusions are represented. Also included: TOK, Extended Essay, CAS, Systems transformation pilot and an additional Language A special-request route. This yields 179 choices, including language and regional History variants. The catalogue is not a promise that every school offers each course or language.

The 126 VCAA indexed subjects/pathways expand to 137 choices through separate English/EAL, Maths, History, Music and Computing courses. All 47 language entries and 29 VET programme listings are included. VET programme groups are not individual qualifications: the qualification and training-unit context must come from the school. No VCE unit numbers are invented for VET. Vocational Major and Structured Workplace Learning Recognition retain their published unit structure.

The 2,110 topic records are original short navigation summaries of public outlines. They do not reproduce complete licensed IB guides, VCAA key knowledge/skills, prescribed texts or assessment tasks. A button identifies an area to practise; the four help buttons describe how to approach it, not new official curriculum statements. Units that share areas and school-selected options remain shared rather than being assigned to an invented teaching sequence. Topic depth must be refined using the actual question or teacher context.

Public IB outlines use separate first/last assessment versions where relevant: Computer science, Design technology, Psychology and Visual arts transition in 2027; History in 2028. Current language acquisition, Maths and Dance versions end in 2028. The UI offers 2026–2028, with a general route for another or unknown year; it does not claim verified 2029 syllabuses. IB SL-only language variants and HL-only regional History follow the official subject-list columns. When the level is uncertain, only shared outline topics appear.

VCAA designs are the current published sources checked in September 2026. Many have open-ended accreditation rather than a published end date. Future unit years show that snapshot explicitly and require teacher confirmation before the prompt claims alignment. The app never equates Year 11 with Units 1/2 or Year 12 with Units 3/4.

School-based subjects, pilots without a public detailed outline, and VET pathways are visibly marked as general help and ask for a short teacher-provided topic. Language frameworks and Auslan retain community/teacher-approved-material guidance. CAS and investigations ask for process support, not fabricated experiences or assessed submissions.

### Audit and rebuild

`scripts/senior/vce-inventory.json` and `ib-inventory.json` record the checked catalogues. `vce-areas.json` preserves source headings and paragraph locators; `vce-labels.json` contains original wording. `build.py` contains original IB summaries with individual official source links, level filters and assessment versions. `source-audit.json` records counts, exclusions and a SHA-256 fingerprint of the generated catalogue (UTF-8 with line endings normalised to LF).

Run `python scripts/senior/build.py`, then `node scripts/senior/check.cjs`. This reproducible build uses only committed reviewed inputs and the Python standard library. Collection/extraction helpers are retained for a future source refresh; raw downloaded guides and extracted paragraphs stay in ignored `output/senior/` and are not shipped. Re-extraction requires review before replacing the committed inputs, including the explicit General Mathematics Unit 3/4 split and removal of PDF continuation lines mistaken for headings.

Explicit IB exclusions: Classical Greek and Roman Studies and Modern History of Kazakhstan (discontinued 2025); World arts and cultures (last assessment May 2026); Food science and technology (discontinued 2017); Reflective project (CP core, not DP). Older discontinued entries in the source PDF are not current choices.

The ACARA Creative Commons attribution above applies to F–10 material only. Senior original summaries do not imply an IB or VCAA licence, affiliation or endorsement. Use the linked authorities for the full applicable course requirements.
