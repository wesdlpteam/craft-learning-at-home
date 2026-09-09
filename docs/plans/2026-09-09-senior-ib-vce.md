# Senior curriculum: IB Diploma and VCE

Date: 9 September 2026
Status: Approved by Nathan (‘Looks good’). Implemented and locally verified on 9 September 2026; see QA.md and CURRICULUM-SOURCES.md for evidence and scope.

## Goal and agreed scope

Extend CRAFT Learning at Home so Years 11 and 12 can choose IB Diploma or VCE, then a subject and a plain-language learning topic. Nathan requested all available subjects, not just those offered at Wesley. Preserve the approved Foundation–Year 10 expansion.

## Proposed experience

1. Parent/student choice and school year stay as they are.
2. For Year 11 or 12, ask which programme: IB Diploma, VCE, or Not sure.
3. Show a searchable subject list grouped by learning area, including languages and distinct course variants.
4. For IB, show Standard Level / Higher Level only where offered, with Not sure. Explain both names in plain language. Include the DP core: Theory of Knowledge, Extended Essay and Creativity, Activity, Service.
5. For VCE, ask which unit (1, 2, 3 or 4), with Not sure. Offer only units available for that subject; retain separate named courses such as Applied Computing pathways, History and Music options. Include VCE Vocational Major and VCE VET pathways under clearly named groups.
6. Ask the relevant course/assessment year when it affects which syllabus applies. Never infer a unit or IB level from school year.
7. Show parent-friendly topics and specific difficulties at the selected senior level. School year remains separate from curriculum level. Own words and unsure paths continue to work.
8. For school-selected options, texts, local language frameworks or unpublished syllabuses, request the topic or a short teacher-provided example. Clearly distinguish verified topic coverage from a general starting point; never invent an official mapping.

## Sources and coverage rules

- IB curriculum index: https://ibo.org/programmes/diploma-programme/curriculum/
- IB full subject list (includes subject codes and SL/HL availability): https://ibo.org/globalassets/new-structure/programmes/dp/pdfs/all-dp-subjects-list-en.pdf
- IB additional/school-based/pilot subjects: https://ibo.org/programmes/diploma-programme/curriculum/other-dp-subjects-offered-by-the-ib/
- VCAA study design index: https://www.vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/vce-study-designs
- VCAA languages index: https://www.vcaa.vic.edu.au/curriculum/vce-curriculum/vce-study-designs/languages/vce-study-designs-languages
- VCAA 2026 design list: https://www.vcaa.vic.edu.au/sites/default/files/2025-12/VCEStudyDesignsList2026.pdf

Build and audit the complete subject inventory before claiming all-subject coverage. Check availability, accreditation and first/last assessment dates against the relevant official pages. Public IB subject briefs are outlines, not complete licensed guides. Write original summaries of publicly verifiable topics and link to the source. Do not copy full copyrighted syllabuses or treat ACARA's licence as applying to IB/VCAA. Archived subjects are not current options; announced future courses must be labelled with their applicable dates. Unknown assessment years must not silently select a potentially different syllabus.

## Implementation steps and files

1. Audit sources and inventories. Proposed `scripts/senior/` extraction/validation utilities and source inventory; document gaps and dated availability in `CURRICULUM-SOURCES.md`. Check that every official current entry has either verified coverage or an explicit, usable general-help route.
2. Add a separate senior data schema, proposed `curriculum/senior/manifest.js` and per-subject JSON. Store programme, original subject name, course variant, allowed level/units, date applicability, topic, original plain-language label, source URL and source locator. Do not fabricate ACARA-style codes.
3. Extend `index.html` and `curriculum-picker.js` with programme, searchable subjects, units/level and date controls. Keep question wording suitable for both audiences. Only show relevant controls; changing context clears untouched generated choices and preserves user-written text.
4. Extend prompt construction with selected programme, course, level/unit and dated source context. Do not mislabel senior content as ACARA. Preserve review-only Claude Artifact instructions, no automatic publishing, no API key, static data loading, no form submission or saved student profiles. Practical and assessed-work support should teach concepts and use practice examples.
5. Extend `scripts/check-curriculum.cjs` or add a dedicated senior check. Validate complete inventory, legitimate combinations, dates, references, unique items and non-empty topic choices. Retain all 2,678 existing F–10 mappings and Maths regression checks.
6. Exercise each subject and available course combination in the browser, plus representative topic-to-prompt flows. Test SL-only, units-only, unknown programme/level/year, switching programme, earlier school years, editing, retry and stale requests. Check desktop 1280x900 and mobile 390x844, keyboard access, console and screenshots.
7. Update README, source/coverage notes and QA. Publish to the separate home repository after checks under the existing publishing authorization. Verify the live version; do not publish any generated Claude artifact.

## Acceptance criteria

- Years 11–12 offer IB DP and VCE with all verified currently listed subjects/language variants discoverable, and transparent coverage for restricted/public-outline cases.
- No Year 11/12 subject is represented as an ACARA F–10 mapping.
- Available units, IB levels and curriculum dates are valid; uncertainty stays explicit.
- Clicking a mapped topic produces the correct programme/course context in the parent or student prompt.
- Existing Foundation–Year 10 data, privacy behaviour and review-only artifact instructions still pass.
- Desktop/mobile flows have readable controls without horizontal overflow.

## Next action

Nathan reviews this senior extension plan. Once approved, audit the full inventories and implement in source-verified batches. The already-approved F–10 release can finish independently.
