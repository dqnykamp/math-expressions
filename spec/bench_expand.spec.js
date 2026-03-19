import me from "../lib/math-expressions";

function benchmarkExpand(expressionText, runs = 1, warmupRuns = 0) {
  const expr = me.fromText(expressionText);

  for (let i = 0; i < warmupRuns; i++) {
    expr.expand();
  }

  const durations = [];
  for (let i = 0; i < runs; i++) {
    const startMs = Date.now();
    const result = expr.expand();
    durations.push(Date.now() - startMs);

    if (!result || result.tree === undefined) {
      throw new Error("expand() returned an invalid expression result");
    }
  }

  const sorted = durations.slice().sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];

  return {
    durations,
    median,
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

describe("expand benchmark", function () {
  test("target expression runtime", function () {
    const target = "(8 (-5 cos(x) + 3 sin(x)))/((45 + 3 cos(x) + 5 sin(x))^3)";
    const maxMedianMs = process.env.ME_BENCH_EXPAND_MAX_MS
      ? Number(process.env.ME_BENCH_EXPAND_MAX_MS)
      : null;

    const runs = Number(process.env.ME_BENCH_EXPAND_RUNS || 1);
    const warmupRuns = Number(process.env.ME_BENCH_EXPAND_WARMUP_RUNS || 0);
    const result = benchmarkExpand(target, runs, warmupRuns);

    console.log("bench:expand:target", {
      expression: target,
      ...result,
      thresholdMs: maxMedianMs === null ? "not-set" : maxMedianMs,
    });

    if (maxMedianMs !== null) {
      expect(result.median).toBeLessThan(maxMedianMs);
    } else {
      expect(result.median).toBeGreaterThan(0);
    }
  }, 180000);

  const runVariants = process.env.ME_BENCH_EXPAND_VARIANTS === "1";
  (runVariants ? test : test.skip)(
    "growth sensitivity sanity check",
    function () {
      const expressions = [
        "(8 (-5 cos(x) + 3 sin(x)))/((45 + 3 cos(x) + 5 sin(x))^2)",
        "(8 (-5 cos(x) + 3 sin(x)))/((45 + 3 cos(x) + 5 sin(x))^3)",
      ];

      const medians = expressions.map((expressionText) => {
        const result = benchmarkExpand(expressionText, 1, 0);
        console.log("bench:expand:variant", {
          expression: expressionText,
          ...result,
        });
        return result.median;
      });

      // Higher power should generally not be faster than lower power.
      expect(medians[1]).toBeGreaterThanOrEqual(medians[0]);
    },
    180000,
  );
});
