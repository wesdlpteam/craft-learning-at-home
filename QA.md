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
