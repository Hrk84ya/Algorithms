#!/usr/bin/env node

/**
 * Manifest validation script for algorithms.json
 * Validates all entries against the schema defined in Property 16.
 *
 * Run: node scripts/validate-manifest.js
 * Exit code 0 on success, 1 on any validation failure.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const VALID_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const VALID_CATEGORIES = [
  'data_structures', 'dynamic_programming', 'graph',
  'mathematical', 'search', 'sorting', 'string', 'tree'
];
const VALID_EXERCISE_TYPES = ['multiple-choice', 'predict-output', 'fill-blank'];
const VALID_VALIDATIONS = [
  'integerList', 'positiveIntegerList', 'positiveInteger', 'edgeList', 'stringPair'
];

let errors = [];

function err(algorithmId, field, message) {
  errors.push(`[${algorithmId}] ${field}: ${message}`);
}

function validateEntry(entry, index) {
  const id = entry.id || `(index ${index})`;

  // Required string fields
  for (const field of ['id', 'name', 'category', 'difficulty', 'description']) {
    if (typeof entry[field] !== 'string' || entry[field].trim() === '') {
      err(id, field, `must be a non-empty string`);
    }
  }

  // Difficulty
  if (entry.difficulty && !VALID_DIFFICULTIES.includes(entry.difficulty)) {
    err(id, 'difficulty', `must be one of: ${VALID_DIFFICULTIES.join(', ')}. Got "${entry.difficulty}"`);
  }

  // Category
  if (entry.category && !VALID_CATEGORIES.includes(entry.category)) {
    err(id, 'category', `must be one of: ${VALID_CATEGORIES.join(', ')}. Got "${entry.category}"`);
  }

  // Complexity
  if (!entry.complexity || typeof entry.complexity !== 'object') {
    err(id, 'complexity', 'must be an object');
  } else {
    for (const field of ['timeBest', 'timeAverage', 'timeWorst', 'space']) {
      if (typeof entry.complexity[field] !== 'string' || entry.complexity[field].trim() === '') {
        err(id, `complexity.${field}`, 'must be a non-empty string');
      }
    }
  }

  // Steps
  if (!Array.isArray(entry.steps) || entry.steps.length === 0) {
    err(id, 'steps', 'must be a non-empty array');
  } else {
    entry.steps.forEach((step, i) => {
      if (typeof step !== 'string' || step.trim() === '') {
        err(id, `steps[${i}]`, 'must be a non-empty string');
      }
    });
  }

  // Paths
  if (!entry.paths || typeof entry.paths !== 'object') {
    err(id, 'paths', 'must be an object');
  } else {
    const hasJava = typeof entry.paths.java === 'string';
    const hasPython = typeof entry.paths.python === 'string';
    if (!hasJava && !hasPython) {
      err(id, 'paths', 'must have at least one of "java" or "python"');
    }
    if (hasJava) {
      const fullPath = resolve(ROOT, entry.paths.java);
      if (!existsSync(fullPath)) {
        err(id, 'paths.java', `file not found: ${entry.paths.java}`);
      }
    }
    if (hasPython) {
      const fullPath = resolve(ROOT, entry.paths.python);
      if (!existsSync(fullPath)) {
        err(id, 'paths.python', `file not found: ${entry.paths.python}`);
      }
    }
  }

  // Exercises
  if (!Array.isArray(entry.exercises) || entry.exercises.length === 0) {
    err(id, 'exercises', 'must be a non-empty array');
  } else {
    entry.exercises.forEach((ex, i) => {
      const prefix = `exercises[${i}]`;
      for (const field of ['id', 'question', 'answer', 'hint']) {
        if (typeof ex[field] !== 'string' || ex[field].trim() === '') {
          err(id, `${prefix}.${field}`, 'must be a non-empty string');
        }
      }
      if (!ex.type || !VALID_EXERCISE_TYPES.includes(ex.type)) {
        err(id, `${prefix}.type`, `must be one of: ${VALID_EXERCISE_TYPES.join(', ')}. Got "${ex.type}"`);
      }
    });
  }

  // Visualization
  if (!entry.visualization || typeof entry.visualization !== 'object') {
    err(id, 'visualization', 'must be an object');
  } else {
    const viz = entry.visualization;
    if (typeof viz.type !== 'string' || viz.type.trim() === '') {
      err(id, 'visualization.type', 'must be a non-empty string');
    }
    if (viz.defaultInput === undefined || viz.defaultInput === null) {
      err(id, 'visualization.defaultInput', 'is required');
    }
    if (typeof viz.inputFormat !== 'string' || viz.inputFormat.trim() === '') {
      err(id, 'visualization.inputFormat', 'must be a non-empty string');
    }
    if (!Array.isArray(viz.inputFields) || viz.inputFields.length === 0) {
      err(id, 'visualization.inputFields', 'must be a non-empty array');
    } else {
      viz.inputFields.forEach((field, i) => {
        const prefix = `visualization.inputFields[${i}]`;
        for (const key of ['name', 'label', 'placeholder']) {
          if (typeof field[key] !== 'string' || field[key].trim() === '') {
            err(id, `${prefix}.${key}`, 'must be a non-empty string');
          }
        }
        if (!field.validation || !VALID_VALIDATIONS.includes(field.validation)) {
          err(id, `${prefix}.validation`, `must be one of: ${VALID_VALIDATIONS.join(', ')}. Got "${field.validation}"`);
        }
      });
    }
  }
}

// Main
const manifestPath = resolve(ROOT, 'algorithms.json');
if (!existsSync(manifestPath)) {
  console.error('ERROR: algorithms.json not found at project root.');
  process.exit(1);
}

let manifest;
try {
  const raw = readFileSync(manifestPath, 'utf-8');
  manifest = JSON.parse(raw);
} catch (e) {
  console.error(`ERROR: Failed to parse algorithms.json: ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(manifest)) {
  console.error('ERROR: algorithms.json must be a JSON array.');
  process.exit(1);
}

manifest.forEach((entry, i) => validateEntry(entry, i));

// Check for duplicate IDs
const ids = manifest.map(e => e.id).filter(Boolean);
const seen = new Set();
for (const id of ids) {
  if (seen.has(id)) {
    errors.push(`Duplicate algorithm ID: "${id}"`);
  }
  seen.add(id);
}

if (errors.length > 0) {
  console.error(`Manifest validation failed with ${errors.length} error(s):\n`);
  errors.forEach(e => console.error(`  ✗ ${e}`));
  process.exit(1);
} else {
  console.log(`✓ Manifest valid. ${manifest.length} algorithm(s) checked.`);
  process.exit(0);
}
