# Expand the parent-friendly curriculum picker
Date: 2026-09-09
Status: Approved by Nathan; implemented and locally verified on 9 September 2026. See QA.md for evidence.

## Goal and agreed scope

Extend the working Maths picker across all eight Australian Curriculum Version 9.0 learning areas, Foundation–Year 10. Include every language and language framework available in the official source. Preserve the parent/student experience, local-only prompt building and manual copying into Claude. Generated artifacts remain for review; publishing is the user's decision.

The current official workbook, downloaded 9 September 2026 and stored locally at output/curriculum/source.xlsx, contains 2,678 content-description rows:
- English: 284
- Mathematics: 240 (already implemented)
- Science: 152
- Humanities and Social Sciences: 333
- Health and Physical Education: 97
- Technologies: 124
- The Arts: 165
- Languages: 1,283

Languages has 18 subject/framework entries, including Arabic, Auslan, Chinese, French, German, Hindi, Indonesian, Italian, Japanese, Korean, Modern Greek, Spanish, Turkish, Vietnamese, Latin, Classical Greek, the Classical Languages framework and the Aboriginal Languages and Torres Strait Islander Languages framework.

The latter frameworks are not a supplied vocabulary curriculum for every named language. Preserve that distinction in the UI and prompt. Do not invent local language content or cultural permissions.

## User experience

Keep the existing sequence: parent/student, school year, subject, topic, skill, optional learning preferences, copied prompt.

Use familiar subject names grouped into the eight learning areas. Show only subjects and topic levels supported for the chosen year. HASS is combined in primary school and separates into History, Geography, Civics and Citizenship, and Economics and Business in Years 7–10. Arts and Technologies retain their individual subjects.

For Languages, add a language selector, followed only when necessary by short plain-language questions that distinguish the official course:
- Started in primary school or started in secondary school?
- Learning it as a new language, already using it at home, or using it as a first language?
Explain these options without making a claim about a child's ability. Include Not sure; uncertainty must not silently assign a curriculum pathway. It can generate a general prompt with a simple clarifying question instead.
Only show combinations actually present in the source.

Map banded content accurately: a Year 4 child sees Years 3 and 4 content where ACARA uses that band. Preserve the actual school year and official topic band separately. The earlier/different-level option shows valid levels for the current subject/course.

Use topic groups to keep choices manageable. Each selectable skill gets a short original plain-language label. Retain the exact official description behind it for the copied prompt. Do not display thousands of choices at once. Existing Maths labels and behavior stay compatible.

Changing subject, language, pathway or level clears any generated selection that no longer applies. Preserve custom user wording, but remove stale curriculum links. Switching parent/student updates generated wording. Reset clears all course selections.

Years 11–12, an unknown year, unknown language course, and unavailable combinations use clearly labelled general/custom help. Do not imply that this release maps senior secondary curriculum.

## Data and implementation

Existing files to update:
- index.html: subject/course selectors, contextual help, source disclosure and script versions.
- curriculum-picker.js: generalise Maths-specific selection and prompt context.
- examples.js: retain appropriate general fallbacks without misleading cross-subject examples.
- scripts/check-curriculum.cjs: expand coverage and integrity checks.
- CURRICULUM-SOURCES.md, README.md, QA.md: coverage, attribution, limitations and verification.

Existing data:
- curriculum-maths.js: preserve verified Maths mapping, then integrate into the same common data model as other subjects.
- output/curriculum/source.xlsx: official source workbook, local working input, not a runtime dependency.

Proposed new files:
- scripts/extract-curriculum.py: reproducible extraction, accounting for workbook headings and pathway/sequence metadata.
- curriculum/manifest.js: list of areas, subjects, supported years/bands and course options.
- curriculum/*.js: static subject/language data files with versioned URLs.
- docs/plans/2026-09-09-all-curriculum-areas.md: this plan.

Each record retains code, official description, area, subject, level/band, strand, sub-strand, sequence and pathway where supplied, plus an original plain-language label and topic grouping. Use a stable identity that distinguishes course variants; do not assume code alone is unique until validated. Keep source version and attribution.

Use local static data files loaded on demand by subject/language to avoid sending all language data on first load. No new package installation, backend, external API, key, analytics, account or answer submission. Show a loading state and a recoverable load failure; prevent a slow previous selection from overwriting a newer selection. Cache loaded data within the page. Version all assets together to avoid the stale-script issue found during Maths deployment.

## Ordered implementation

1. Extract and audit the full source inventory.
   Verify totals, required fields, unique identities, supported bands and language course combinations. Preserve verbatim descriptions and source attribution. Check source download/version before finalising coverage.
2. Build the common data model and plain-language labels.
   Work through English and Science, Humanities, Health/PE, Arts and Technologies, then all language courses. Review each label against its own descriptor; avoid mechanical word substitutions that change the learning target. Retain subject-specific distinctions.
3. Generalise the picker and add course selection.
   Preserve existing Maths flow. Add band mapping, conditional language questions, valid earlier-level options, uncertainty fallbacks and loading/error handling. Check dependent selections and keyboard focus.
4. Adapt prompt generation.
   Include only the selected course's real description, code, band and source. Keep parent/student language, manual review and privacy constraints. Practical subjects should offer an appropriate learning aid or explanation, rather than pretending a web page replaces physical performance. For language/cultural content requiring teacher or community guidance, ask for an appropriate approved example rather than inventing one.
5. Run data and browser verification.
   Complete the checks below, fix findings and inspect saved desktop/mobile screenshots.
6. Publish and verify.
   Update documentation and source credit. Commit and push to wesdlpteam/craft-learning-at-home under the existing publication authorization after the reviewed plan is accepted and checks pass. Confirm GitHub Pages deployment and exercise the public page, including cache behavior. Leave the teacher repository untouched.

## Acceptance checks

- All 2,678 source rows are accounted for with exact code, description, year/band and course metadata; any source-version change is explicitly reconciled.
- Every selectable label corresponds to its actual curriculum record; no unavailable year, pathway or subject is invented.
- All eight areas and all 18 language/framework entries can be reached at their supported levels.
- Automated checks exercise the full selection matrix and prompt mapping, including all course variants and band boundaries.
- Browser checks use normal UI interactions for every subject and language/course family, plus representative primary and secondary years.
- Regression: Year 6 fraction addition/subtraction still maps to AC9M6N05.
- Switching subject/course/level, earlier learning, uncertain course, custom edits, audience changes, validation, back navigation, copy and reset do not leave stale codes.
- Slow or failed data loads cannot generate a prompt from a previous selection; a retry/custom entry is available.
- Desktop 1280x900 and mobile 390x844: initial and meaningful selected states, readable labels, no horizontal overflow, visible focus and working keyboard access. Save and open screenshots under CODEX_VISUAL_EVIDENCE_DIR.
- No browser errors in the final local and public flows; network inspection shows only static app assets until the user deliberately opens an external link.
- Generated prompt requests a Claude artifact for review and explicitly forbids automatic publication.
- Data is a content-description adaptation, not a rewrite of all elaborations or achievement standards or a claim of ACARA endorsement.

## Next action

Nathan reviews this plan. On acceptance, implement the full scope in the order above without restarting brainstorming or seeking repeat publication approval.
