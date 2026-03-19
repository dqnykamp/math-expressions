# Expand/Simplify Performance Handoff

## Goal

Primary target expression:

```text
(8 (-5 cos(x) + 3 sin(x)))/((45 + 3 cos(x) + 5 sin(x))^3)
```

The goal was to reduce the time spent in `expand()` and the downstream simplify pipeline, with a practical focus on the transformation-heavy path used by this expression.

## High-Level Outcome

- We confirmed that the dominant bottleneck is not the top-level `expand()` wrapper itself, but the simplify/collection work it triggers, especially `collect_like_terms_factors` in [lib/expression/simplify.js](lib/expression/simplify.js).
- We improved runtime substantially from the initial multi-second-to-tens-of-seconds behavior, but did not reach the desired sub-1-second target.
- The best validated improvements came from reducing unnecessary generic transformation work rather than micro-optimizing arithmetic.
- Latest full-suite status: `npm run test:all` passes.

## What We Investigated

### 1. Instrumentation and Profiling

We added profiling so the hot path could be measured instead of guessed.

Key additions:

- [lib/perf/expand-profile.js](lib/perf/expand-profile.js): profiler helpers and counters
- [lib/expression/transformation.js](lib/expression/transformation.js): stage timing for `expand()`
- [lib/trees/basic.js](lib/trees/basic.js): counters around matching, transformation application, and cloning
- [spec/bench_expand.spec.js](spec/bench_expand.spec.js): benchmark harness for the target expression
- [package.json](package.json): `test:bench` entry

Useful commands:

```bash
ME_PROFILE_EXPAND=1 npx babel-node ./lib/meTest.js
npm run test:all
```

What profiling showed:

- `collect_like_terms_factors` dominated total runtime.
- `applyAllTransformations` and `matchOperands` were responsible for the bulk of the cost.
- The expensive part was combinatorial matching: permutations, extended matches, subset enumeration, and repeated passes over large transformation lists.

### 2. Matcher and Transformation Engine Work

We optimized the generic rewrite engine in [lib/trees/basic.js](lib/trees/basic.js).

Changes that helped:

- quick-reject logic for impossible pattern/operator combinations
- cached default ordering for patterns
- transformation prefiltering using required operators/functions
- pruning some permutation candidates in `matchOperands`
- profiling counters to verify which paths were still hot

Result:

- These changes produced real gains and reduced waste.
- They were necessary, but not sufficient. The generic matcher still spends too much time exploring rewrite possibilities for this workload.

### 3. Simplify-Specific Gating

We then focused on [lib/expression/simplify.js](lib/expression/simplify.js), specifically `collect_like_terms_factors`.

Changes that helped:

- selective activation of root-related rules based on whether the tree actually contains `sqrt`, `cbrt`, `nthroot`, or `abs`
- selective activation of unit-related rules only when the tree contains a `unit` operator
- a follow-up cleanup to combine separate tree scans into one pass via `collectTreeFeatures`

Why this worked:

- Many expensive rule families were being built and considered even when the expression could never match them.
- Skipping irrelevant transformations reduced both transformation list size and matching work.

Current relevant code:

- [lib/expression/simplify.js](lib/expression/simplify.js)

### 4. Evaluation-Side Precheck

We also added a small precheck in [lib/expression/evaluation.js](lib/expression/evaluation.js) to skip nth-root transformation work unless the tree shape made it relevant.

This helped modestly and was safe.

## What Worked

### Strong wins

- Profiling before changing behavior
- Reducing generic matcher work with early rejection and prefiltering
- Gating expensive rule families based on actual tree features
- Keeping each optimization validated with the full test suite

### Moderate wins

- Small evaluation-time guards
- Combining multiple feature scans into one tree traversal

### Why these wins mattered

The codebase leans heavily on a generic transformation engine. For this expression, the main cost is not a single bad arithmetic routine; it is the repeated attempt to match many high-flexibility rules against trees that do not need most of them.

## What Did Not Work or Was Not Safe

### 1. Broad root-rule gating

We tried aggressively disabling root-related simplification work more broadly.

Outcome:

- Speed improved significantly.
- Correctness regressed.

Observed failures were in root simplification behavior, especially cases involving powers under real assumptions such as:

- `sqrt(x^4)`
- `nthroot(x^4 y^8, 4)`

Why it failed:

- Some root transformations have subtle semantic dependencies on `abs` handling and real/positive assumptions.
- Broadly removing the rules broke those interactions.

Lesson:

- Presence-based gating is much safer than blanket disabling.

### 2. Pure low-level matcher tuning as the only strategy

Outcome:

- Helped, but hit diminishing returns.

Lesson:

- The remaining cost is structural. Further small matcher tweaks are unlikely to deliver the next order-of-magnitude improvement on their own.

## Performance Testing Notes

### Benchmarking approaches used

1. `ME_PROFILE_EXPAND=1 npx babel-node ./lib/meTest.js`
2. `npm run test:all`
3. [spec/bench_expand.spec.js](spec/bench_expand.spec.js)

### Important nuance

The numbers from `meTest.js` and the Jest benchmark spec are not directly interchangeable.

- `meTest.js` with profiling was useful for hotspot analysis and relative change tracking.
- The Jest benchmark spec includes harness overhead and tends to report much larger wall-clock times.

### Representative measured state near the latest validated changes

- `expand`: about `7.6s` in the profiling run
- `collect_like_terms_factors`: about `7.58s`
- `applyAllTransformations.max_transformations`: reduced to around `16` after gating work
- `matchOperands.subsets.enumerated`: still very high, on the order of hundreds of thousands
- benchmark spec for the target expression: roughly `27s` to `30s` wall time in Jest

Interpretation:

- We removed a meaningful amount of unnecessary work.
- The dominant hotspot remains the generic transformation search space.

## Regression Investigation

We investigated the user's suspicion that the problem worsened after `v2.0.0-alpha81`.

Outcome:

- The suspicion was correct.
- A benchmark bisect showed a significant regression after `alpha81`.
- Commit `0272c7e` stood out as an important regression point tied to root simplification expansion behavior.

Why this matters:

- Some of the current cost is not inherent to the original design; it was introduced by later simplification behavior.
- That supports targeted rollback, gating, or redesign of the relevant simplification families.

## Lessons Learned

1. The root cause is combinatorial rewrite search, not one isolated slow helper.
2. The most effective safe optimizations were relevance filters that prevent transformation families from being considered at all.
3. Correctness in root simplification is assumption-sensitive, especially around `abs`, even roots, and real-valued expressions.
4. Micro-optimizations in the matcher help, but they do not replace the need for a more specialized algorithm in `collect_like_terms_factors`.
5. Full-suite validation is necessary after each simplification change; many failures only show up in slower symbolic tests.

## Best Candidate Next Steps

If handing off to another agent, these are the most promising avenues.

### 1. Replace generic like-term collection with a deterministic collector

This is the highest-value next step.

Idea:

- Instead of using many generic rewrite patterns to combine terms and factors, parse sums/products into canonical coefficient-plus-key forms.
- Aggregate like terms/factors using a map keyed by a canonical representation.

Why it is promising:

- It avoids permutation/subset matching entirely for the most common algebraic collection cases.
- It directly targets the current hotspot.

Potential scope:

- additive term collection: `n*x + m*x`
- multiplicative exponent collection: `x^n * x^m`
- rational coefficient normalization

### 2. Add more tree-feature gating for other expensive rule families

Likely candidates:

- `exp`-specific rules
- power-related rules that only matter when `^` exists
- division normalization passes that can be skipped when `/` is absent

Why it is promising:

- This continues the same strategy that already worked.
- It is lower risk than a full collector rewrite.

### 3. Introduce transformation family partitioning

Idea:

- Split `collect_like_terms_factors` into named phases with smaller, targeted rule lists.
- Run each phase only if the tree contains the relevant operators/functions.

Why it is promising:

- The current large transformation arrays create too much irrelevant matching pressure.

### 4. Cache canonical subtree properties more aggressively

Idea:

- Memoize subtree feature summaries, operator presence, or canonical keys when the same structures are revisited.

Risk:

- Worth doing only if profiling shows repeated recomputation on identical structures.
- This is likely lower impact than the deterministic collector.

### 5. Revisit the post-`alpha81` root simplification behavior

Idea:

- Narrowly identify which root simplification expansions are truly required for correctness versus which are over-eager.
- Preserve only the semantics-critical cases.

Why it is promising:

- The regression analysis suggests there may still be safely removable or further gateable work in this area.

## Suggested Handoff Starting Point

If another agent picks this up, the recommended order is:

1. Read [lib/expression/simplify.js](lib/expression/simplify.js), especially `collect_like_terms_factors`.
2. Read [lib/trees/basic.js](lib/trees/basic.js) to understand current matcher optimizations and profiling counters.
3. Run:

```bash
ME_PROFILE_EXPAND=1 npx babel-node ./lib/meTest.js
```

4. Confirm the current hotspot is still `collect_like_terms_factors`.
5. Prototype a deterministic collector for a narrow subset of cases before attempting a full rewrite.
6. Validate every change with:

```bash
npm run test:all
```

## Practical Warning for Future Work

Do not trust local performance wins unless both of these stay true:

- the symbolic simplify tests remain green
- the target expression actually improves in the profiler, not just in a synthetic microbenchmark

The main failure mode so far has been making root-related behavior faster by removing semantics that are required under assumptions.
