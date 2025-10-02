# Ask VA Take-Home Assignment

**Note:** This is our first time using this take-home assignment. There may be rough edges or unclear parts. If anything is ambiguous, make reasonable assumptions, state them in your submission, and proceed. Feedback is welcome!

## Instructions

- Timebox: Please don't spend more than 2 hours on this, less is probably fine
- Part 1: Write an outline describing your approach to moving from manual to automated testing in a complex environment. Focus on:
  - Initial Priorities
  - Tooling / Framework choices
  - How you'd handle test data within the environment
  - Rollout plan (not every detail)
- Part 2: Write Jest (or anything else -- solution configured with jest) tests against the provided `crmAdapter.ts` module covering:
  - normalizePhone
  - redactPII
  - buildCrmCase
  - (Optional) listCases or getAuthToken

## Running Tests

```bash
npm install
npm test
```

You may see deprecation warnings (e.g., inflight or glob). These come from third-party tooling and do not affect the assignment. It’s safe to ignore them.

## Walkthrough 
During the interview, be prepared to turn your camera on, share your screen, walk us through your approach explaininging the reasoning and logic behind it, and then walk us through your tests. Highlight areas that you feel are relelvant. There is not a right answer. We're looking to see how you think and approach the work.

