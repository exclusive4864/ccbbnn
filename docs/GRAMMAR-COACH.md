# Grammar Coach maintenance

## Content

The main curriculum has 20 lessons. Linking Lab adds eight focused packs. All explanations, examples, exercises, feedback and transfer tasks are original teaching material. No source-book text or private learner submissions are part of the public repository.

The build combines three main-curriculum JSON files, three Linking Lab JSON files and verified source lists into `data/grammar-course.json`, then embeds it with the CSS/core/UI scripts in `grammar-coach.html`. Editing the generated HTML alone will be overwritten by the next build.

Each main lesson has 6 core worked examples plus 4 extension examples; each Linking Lab pack has 12 core plus 4 extension examples. The extension examples are read from `data/grammar-extra-examples-{a,b,c}.json` and shown in an expandable section. Every lesson/pack has 4 guided and 8 independent exercises, along with a self-checked transfer-writing task. Explanations distinguish errors from legitimate alternatives, changes in meaning and differences in register or dialect.

## Learning and grading boundaries

- Exact-answer practice checks only the targeted form and listed variants. It ignores capitalization, repeated spacing and curly versus straight apostrophes. A final period is optional outside the punctuation lesson.
- Rewrite prompts constrain the requested operation. Add valid common alternatives to `answers` when needed; do not pretend exact-match rejection proves the whole sentence is ungrammatical.
- Choice questions need one best answer in the stated context, with explanations for every distractor. Do not make stylistic preferences, optional Oxford commas or standard dialect variants into right/wrong grammar tests.
- Word-order exercises shuffle token/chunk banks at runtime. Tokens can be multiword chunks.
- Personal writing is self-assessed with a checklist. The app does not send it to a server or assign an IELTS band.

## Review state

`writewise-grammar-coach-v1` is isolated from the other modules. Mistakes record the submitted answer, last wrong answer and up to eight recent attempts. Wrong answers return in about 10 minutes. Successful independent due reviews advance through 1/3/7/14/30 days. Hinted answers and early repeats do not raise the level. A previously missed item leaves the unresolved queue after two successful due reviews; its history remains available.

Backups require explicit preview/confirmation before replacing Grammar Coach progress. Corrupt stored data is not silently overwritten. Cross-tab changes pause writes until reload. A failed write does not create a false cross-tab conflict; a failed import does not announce success or discard the retryable import.

## Checks

1. `python scripts/build-grammar-coach.py`
2. `node tests/grammar-coach.test.js`
3. `node tests/grammar-coach-dom.test.js` and `node tests/grammar-coach-edge.test.js` with JSDOM available. Set `JSDOM_PATH` to an installed module path when needed.
4. `node tests/speaking-coach.test.js` to check the linked existing module.
5. `node tests/grammar-coach-browser.test.js` where Playwright/Chromium can launch. It covers the actual UI at 320, 390, 768 and 1280 pixels, large text, all exercise types, persistence, navigation and import/export. Set `BASE_URL` for a hosted target; otherwise it launches a local static server.
6. Verify the deployed commit and open the public page. Distinguish DOM tests from native layout/interaction checks; do not report a browser test as passed when browser launch was unavailable.
