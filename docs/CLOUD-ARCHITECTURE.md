# Writewise Cloud & Content Architecture

## Goal
Make Writewise easy to continue from any device while keeping IELTS content structured, reusable, and safe to expand.

## Two different kinds of data

### 1. Project source (shared across devices)
Stored in GitHub.
- HTML/CSS/JavaScript
- IELTS topic catalog
- question-type catalog
- model essays and Thai explanations
- vocabulary/collocations
- infographic asset references

This means development can continue from a computer, iPad, or another device as long as the same GitHub repository is accessible.

### 2. Learner progress (currently device-local)
The current Writewise app stores progress in browser localStorage. This includes drafts, completed items, settings, and practice notes.
localStorage does **not** automatically sync between devices.

A later phase should add authenticated cloud sync (for example Supabase or Firebase) so the same user can see the same progress on iPad, iPhone, and computer.

## Recommended learning navigation

Topic
→ Question type
→ Exercise
→ Study sheet
→ Model essay
→ Thai explanation
→ Vocabulary & collocations
→ Grammar / structures to study
→ Practice / recall

## Ten core Task 2 topics
1. Education
2. Transportation
3. Tourism
4. Technology
5. Family
6. Health
7. Environment
8. Work
9. Crime
10. Social Media

## Nine Task 2 question types
1. Agree / Disagree
2. Discuss Both Views + Opinion
3. Positive / Negative Development
4. Advantages / Disadvantages
5. Do Advantages Outweigh Disadvantages?
6. Problems + Solutions
7. Causes + Solutions
8. Two-Part Question
9. Direct Question

## Content quality gate
An exercise is publishable only when:
- the question type is classified correctly;
- the response answers every instruction in the prompt;
- the model essay uses a clear four-paragraph structure unless the task genuinely requires otherwise;
- English is natural and appropriate for the target band;
- Thai translation is checked for meaning and readability;
- reusable sentence patterns are explicitly marked;
- topic vocabulary and collocations are accurate;
- grammar/structures worth studying are listed;
- the infographic is readable on iPad/mobile and is not the only source of the content.

## Source-of-truth rule
Do not store learning content only inside an image.

Each exercise should have structured text data first. The infographic is a visual study layer generated from or linked to that content.

Suggested path:
```
data/task2/<topic>/<question-type>/<exercise-id>.json
assets/task2/<topic>/<question-type>/<exercise-id>.png
```

## Cloud-sync roadmap
Phase 1 — GitHub becomes the canonical project/content source.
Phase 2 — Move Task 2 lesson content from large inline JavaScript objects into JSON.
Phase 3 — Build Topic → Question Type → Exercise navigation.
Phase 4 — Add sign-in and cloud learner-progress storage.
Phase 5 — Add migration/import from existing localStorage backups.

## Safety / rollback
New architecture work should be developed on a feature branch and reviewed before merging to main so the current GitHub Pages site remains usable.
