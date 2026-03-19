function getEnvValue(name) {
  if (typeof process === "undefined" || !process.env) {
    return undefined;
  }
  return process.env[name];
}

function nowMs() {
  if (
    typeof process !== "undefined" &&
    process.hrtime &&
    typeof process.hrtime.bigint === "function"
  ) {
    return Number(process.hrtime.bigint()) / 1e6;
  }

  return Date.now();
}

function countTreeNodes(tree) {
  let count = 0;
  const stack = [tree];

  while (stack.length > 0) {
    const current = stack.pop();
    count += 1;

    if (Array.isArray(current)) {
      for (let i = 1; i < current.length; i++) {
        stack.push(current[i]);
      }
    }
  }

  return count;
}

let enabledCache;

export function expandProfilerEnabled() {
  if (enabledCache === undefined) {
    enabledCache = getEnvValue("ME_PROFILE_EXPAND") === "1";
  }
  return enabledCache;
}

let currentRun = null;

function ensureRun() {
  if (!currentRun) {
    currentRun = {
      metadata: {},
      counters: {},
      durationsMs: {},
      max: {},
      trees: {},
      startedAtMs: nowMs(),
    };
  }

  return currentRun;
}

export function expandProfilerStartRun(metadata = {}) {
  if (!expandProfilerEnabled()) {
    return;
  }

  currentRun = {
    metadata,
    counters: {},
    durationsMs: {},
    max: {},
    trees: {},
    startedAtMs: nowMs(),
  };
}

export function expandProfilerIncrementCounter(name, delta = 1) {
  if (!expandProfilerEnabled()) {
    return;
  }

  const run = ensureRun();
  run.counters[name] = (run.counters[name] || 0) + delta;
}

export function expandProfilerAddDurationMs(name, deltaMs) {
  if (!expandProfilerEnabled()) {
    return;
  }

  const run = ensureRun();
  run.durationsMs[name] = (run.durationsMs[name] || 0) + deltaMs;
}

export function expandProfilerRecordMax(name, value) {
  if (!expandProfilerEnabled()) {
    return;
  }

  const run = ensureRun();
  if (!(name in run.max) || value > run.max[name]) {
    run.max[name] = value;
  }
}

export function expandProfilerRecordTreeSize(name, tree) {
  if (!expandProfilerEnabled()) {
    return;
  }

  const run = ensureRun();
  run.trees[name] = countTreeNodes(tree);
}

export function expandProfilerStartTimer() {
  if (!expandProfilerEnabled()) {
    return null;
  }

  return nowMs();
}

export function expandProfilerEndTimer(startMs, durationKey) {
  if (!expandProfilerEnabled() || startMs === null) {
    return;
  }

  expandProfilerAddDurationMs(durationKey, nowMs() - startMs);
}

export function expandProfilerFinishRun() {
  if (!expandProfilerEnabled()) {
    return null;
  }

  const run = ensureRun();
  run.durationsMs.total = nowMs() - run.startedAtMs;

  const result = {
    metadata: run.metadata,
    counters: run.counters,
    durationsMs: run.durationsMs,
    max: run.max,
    trees: run.trees,
  };

  if (getEnvValue("ME_PROFILE_EXPAND_LOG") !== "0") {
    console.log("expand-profile", result);
  }

  currentRun = null;
  return result;
}
