# Browser verification

Verified through http://127.0.0.1:8766/ using the installed Playwright CLI on 8 September 2026.

Inventory: parent/student entry choice; audience-specific questions, examples and generated prompts; required age and learning difficulty; optional preferences; back/edit preservation; copy and clipboard-denied fallback; restart cancellation and clearing; keyboard focus; desktop/mobile layout; console errors.

Observed passing: both prompt voices, required-field messages, optional preferences included in prompt, retained answers on back/edit, audience switching, clipboard success and fallback, restart cancel/confirm and keyboard focus. No horizontal overflow at desktop 1280x900 or mobile 390x844. Browser console: 0 errors, 0 warnings. Final regenerated prompt scroll position: 0.

Screenshots in local output/playwright (excluded from Git):
- desktop-welcome.png: 1280x900, audience choice; clear text and controls.
- desktop-parent-prompt.png: 1280x900, full-page parent result; readable prompt and actions without clipping.
- mobile-welcome.png: 390x844, audience choice; controls fit and text wraps cleanly.
- mobile-student-prompt.png: 390x844, full-page student result; readable instructions, prompt and actions, no horizontal overflow.

Every screenshot was opened and visually inspected. The temporary local servers and browser session were stopped after verification. No Claude request was submitted; generated artifact quality is outside this builder verification. No API key is required.

## Age-based examples update

Added nine clickable suggestions for each of seven age bands (63 suggestions), grouped into maths, reading/writing and science, with three separate optional basic starting points. These are suggestions rather than curriculum mappings.

Playwright exercised every suggestion. Verified 12–13 fractions includes different denominators and 3/4 + 2/3; matching untouched examples update with age; user edits survive age changes; parent/student voice changes; keyboard activation; optional simpler examples; the final Claude prompt includes the selected task and does not automatically lower its level. Both JavaScript syntax checks and git diff --check passed. Browser console: 0 errors, 0 warnings.

Visually inspected full-page screenshots in output/playwright:
- age-desktop-options.png: 1280x900, initial age 12–13 choices, readable subject groups and buttons.
- age-desktop-fractions.png: 1280x900, parent selects Fractions, complete example is readable.
- age-mobile-options.png: 390x844, student choices, buttons wrap without horizontal overflow.
- age-mobile-fractions.png: 390x844, student selects Fractions with simpler options expanded, text box grows to show the full example and controls remain readable.

## Artifact publishing prompt update

Both the teacher and home builders now explicitly request the Artifact tool with the supplied opening prompt. Existing CRAFT answers remain included; Claude is asked only for missing details. Teacher HTML download is optional and secondary. Both explain unavailable publishing or sharing instead of promising a public link.

Browser checks: teacher full wizard and copy; home parent and student prompts and copy; 1280x900 and 390x844. Passed prompt assertions, JavaScript syntax and whitespace checks. All four screenshots were opened and visually inspected: readable text and controls, no horizontal overflow. Teacher local preview logs CORS failures from its existing analytics endpoint; home console has zero errors. This does not verify an actual Claude artifact publication or account permissions.

Evidence in output/playwright:
- artifact-teacher-desktop.png: 1280x900, teacher final prompt and publishing guidance.
- artifact-teacher-mobile.png: 390x844, teacher copied state and wrapped guidance.
- artifact-home-desktop.png: 1280x900, parent final prompt and publishing guidance.
- artifact-home-mobile.png: 390x844, student copied state and publishing guidance.

Reference: https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them and https://support.claude.com/en/articles/9547008-publish-and-share-artifacts . Claude Code artifacts cannot be shared publicly; regular chat publishing/sharing depends on the plan.

## Review before publishing correction

Teacher, parent and student output now requests creation with the Artifact tool for review only. Explicitly forbids automatic publishing, sharing or creating a public link and leaves publishing to the user. Checked full teacher wizard, both home audiences and copy actions. All prompt assertions passed. Home console: zero errors; teacher retains the known local analytics CORS errors. No horizontal overflow.

Visually inspected final prompt/copy states: review-first-teacher-desktop.png (1280x900), review-first-teacher-mobile.png (390x844), review-first-home-desktop.png (1280x900 parent), review-first-home-mobile.png (390x844 student), all in output/playwright. Wording and controls are readable. Teacher screenshots captured with animations disabled to avoid recording mid-fade. No Claude artifact was published during testing.

## Maths curriculum picker — 9 September 2026

- PASS: node scripts/check-curriculum.cjs — 240 unique descriptors, 11 year counts, code/year/strand mapping, valid labels and JavaScript syntax.
- PASS: every official description, code, year and strand compared with the extracted ACARA V9 workbook.
- PASS: real-browser clicks of all 240 skill choices; each prompt contains the matching code and official description.
- PASS: Year 6 fraction addition/subtraction produces AC9M6N05; earlier Year 2 topic retains school year Year 6.
- PASS: parent/student wording, manual edit removal of mapping, year/subject change, general subject filters, unsure path, senior/unknown-year fallback, reset and required-field validation.
- PASS: copy feedback and explicit review-only artifact instructions; desktop and mobile prompt generation; keyboard activation.
- PASS: desktop 1280x900 and mobile 390x844 initial and selected states. Full-page screenshots opened and inspected: readable text, wrapping, selected state, spacing, focus and no horizontal overflow. A stray encoding character was fixed and screenshots recaptured.
- PASS: browser console 0 errors, 0 warnings. Network inspection showed only the page and its three local JavaScript assets.
- Visual evidence (local, ignored): output/playwright/maths-desktop-initial.png, maths-desktop-selected.png, maths-mobile-initial.png, maths-mobile-selected.png.
- QA inventory and browser check scripts are saved in output/curriculum/ (local, ignored).
- Curriculum labels are simplified adaptations, not ACARA endorsement; full teaching elaborations, achievement standards and Year 10A are outside scope.

## All Foundation–Year 10 areas — 9 September 2026

Inventory before testing: `output/curriculum/all-QA-inventory.md` (local, ignored). Tested through http://127.0.0.1:8766/ using Playwright CLI.

- PASS: `node scripts/check-curriculum.cjs`: 2,678 exact source fingerprints, 34 subjects/frameworks, 18 language/framework entries, 54 courses and 256 course-level combinations. All labels, topic identities, course metadata and the existing 240 Maths labels/descriptions pass.
- PASS: a fresh official workbook download extracted to identical descriptor content and metadata for all 2,678 rows. Workbook binary hashes differ, so this is a record-content comparison rather than a byte-identical download claim.
- PASS: real browser clicks of all 2,678 skills across every course-level combination. Each generated prompt contains that exact code, official description and selected level. Browser selection log contains 2,678 entries and 2,678 unique codes.
- PASS: earlier topic level retains actual school year; custom edits remove the reference; custom text survives context changes; untouched generated choices clear on subject/pathway changes. Unknown sequence does not infer a course. Own words, unsure text, parent/student switching, Auslan instructions and framework approved-example guidance pass.
- PASS: complete parent and student prompt flows, copy feedback, edit and restart clearing. Prompt still requests Claude's Artifact tool and explicitly forbids automatic publishing/sharing.
- PASS: simulated HTTP 503 shows a retry, retry loads topics and preserves custom text. A delayed previous subject response cannot replace the current subject. The intentional 503 produced the expected browser resource error.
- PASS: a subsequent clean full flow recorded zero console/page errors and only same-origin GET requests for static app/curriculum files. The test's written-answer marker was absent from requests; no POSTs or request bodies occurred.
- PASS: keyboard Enter selects a skill. Desktop 1280x900 and mobile 390x844 have no horizontal overflow.
- PASS: `git diff --check`.

Final screenshots in local `output/playwright/` were each opened with `view_image` and visually inspected:

- `all-desktop-initial.png`: 1280x900, audience entry; readable heading, buttons and privacy note.
- `all-desktop-chinese.png`: 1280x900, parent Year 8 Chinese course and selected skill; course controls, topic grid, selection and complete difficulty text fit clearly.
- `all-mobile-initial.png`: 390x844, audience entry; clean wrapping and comfortably sized buttons.
- `all-mobile-framework.png`: 390x844, student Year 6 First Nations framework with revival pathway; long names, framework explanation and selected skill wrap without clipping or overlap.

Scope limit: these checks verify the prompt builder and source linkage, not the educational quality of a subsequently generated Claude artifact. Senior IB DP/VCE expansion has a separate proposed plan and is not part of this F–10 release.


## Years 11–12 IB Diploma and VCE — 9 September 2026

QA inventory was written before browser testing: `output/senior/QA-INVENTORY.md`. Tested the normal HTTP preview with Playwright CLI.

- PASS: `node scripts/senior/check.cjs` — 316 unique choices, every one of 174 current IB source entries and 126 VCAA index entries represented, allowed levels/units, exclusions, first/last assessment transitions, original labels and source fingerprint.
- PASS: `node scripts/check-curriculum.cjs` — all 2,678 existing F–10 fingerprints, 34 subjects, 18 language/framework entries, 54 courses and 256 course/level combinations.
- PASS: browser exercised all 316 senior choices, 1,268 course/year/level combinations and clicked all 2,110 unique topic buttons; generated wording matched each clicked topic.
- PASS: IB 2026/2027 Computer science transition, SL/HL filtering, uncertain level/year, Hebrew B SL-only, regional History HL-only, 2028 History version, CAS and school-specific fallback.
- PASS: French variants, Maths search alias, no-results recovery, full selected names for long courses, VCE General Mathematics Unit 3/4 separation, Algorithmics restrictions and VET without invented units.
- PASS: parent/student voices and switching, all four help choices, keyboard activation/focus, editing removes mapping, own words, unsure, course/programme/year/unit changes, custom text preservation and restart clearing.
- PASS: failed static-data load and retry; delayed senior response after switching to Year 6 did not replace the F–10 picker. The deliberately aborted request produced the expected network error in that resilience session; the clean final visual session had 0 errors and 0 warnings.
- PASS: complete senior and F–10 prompt flows. Senior output contains the selected course/unit/level/year/source without a stale ACARA description; requests the Claude Artifact tool for review and explicitly prohibits automatic publishing/sharing. Mobile IB Computer science SL output uses the 2027 version and student voice.
- PASS: no network requests occurred while entering written answers and generating a prompt. Only static same-origin curriculum assets load; the builder has no API key, backend, persistent student profile or automatic Claude submission.
- PASS: desktop 1280x900 and mobile 390x844, initial topics and a meaningful selected-topic/help state. All final full-page screenshots were opened at original resolution and visually inspected: readable text, complete placeholders, clear focus/selection, balanced spacing, consistent card edges, no clipping or horizontal overflow. Browser scrollbars are included in viewport measurements; screenshot content widths exclude them.

Final visual evidence (local, ignored under `output/playwright/`):
- `senior-desktop-initial.png`: parent, Year 12, VCE General Mathematics Unit 3, topic choices before selection.
- `senior-desktop-selected.png`: parent, savings/loans topic and worked-example help selected; full generated sentence visible.
- `senior-mobile-initial.png`: student, Year 11, IB Computer science SL, 2027, topic choices before selection.
- `senior-mobile-selected.png`: student, programming topic and worked-example help selected; complete wording and next-step controls visible.

Browser scripts are retained in ignored `output/senior/`. The checks validate this prompt builder and its stated outline coverage; they do not certify the content or publishing permissions of an artifact subsequently created in Claude.


## Explicit Artifact tool output — 9 September 2026

Removed the downloadable-file alternative from generated instructions. The opening and build section explicitly require Claude's Artifact tool and a working app in the artifact panel. A tool-unavailable instruction prevents claiming an artifact was created when it was not. Publishing remains manual.

QA inventory: `output/artifact-tool-QA.md`. Parent and student normal form flows passed in Playwright: no HTML wording in either generated test prompt, required Artifact tool/panel wording present, supplied fraction difficulty retained, automatic publishing prohibited. Both existing curriculum checks passed. Browser console: 0 errors and warnings. Desktop 1280x900 and mobile 390x844 had no horizontal overflow.

Opened and visually inspected all four full-page screenshots in `output/playwright/`: `artifact-tool-parent-initial.png` and `artifact-tool-parent-prompt.png` (desktop initial/result), `artifact-tool-student-initial.png` and `artifact-tool-student-prompt.png` (mobile initial/result). Text, controls and prompt opening are readable, with clean wrapping and no unintended clipping. This verifies the builder's instructions, not a guarantee of Claude's subsequent behaviour.


## Australian hobbies and phrasing — 9 September 2026

Prompt guidance now defaults unqualified football/footy to Australian rules football (AFL) for this app's family context, respects explicitly named other codes, and uses Australian wording, spelling, metric units, dollars and local settings. Other materially ambiguous interests can trigger a short clarification. The interests placeholder now says footy (AFL).

Verified normal parent and student flows with football/footy and explicit soccer/netball interests. Both test prompts retain the supplied hobby, include the AFL default and explicit-choice exception, preserve Artifact-tool instructions and manual publishing, and contain no HTML-file wording. Existing F–10 and senior static checks pass. Browser console: 0 errors/warnings; no horizontal overflow.

QA inventory: output/australian-context-QA.md. Four screenshots in CODEX_VISUAL_EVIDENCE_DIR were opened and visually inspected: australian-parent-interests.png and australian-parent-prompt.png (1280x900); australian-student-interests.png and australian-student-prompt.png (390x844). Interest controls and scrollable prompt previews are readable with clean wrapping. These checks verify the generated instructions; Claude's resulting activity was not generated or independently assessed.
